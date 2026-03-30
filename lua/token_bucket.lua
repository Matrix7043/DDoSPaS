local redis = require "resty.redis"

local red = redis:new()
red:set_timeout(1000)

local ok, err = red:connect("redis", 6379)
if not ok then
    ngx.log(ngx.ERR, "Redis connection failed: ", err)
    return ngx.exit(500)
end

local uri = ngx.var.uri or ""
ngx.log(ngx.ERR, "DEBUG - START PROCESSING URI: ", uri)

local api_key, endpoint_path = uri:match("^/gateway/([^/]+)/(.*)")
api_key = api_key or ""
endpoint_path = endpoint_path or ""
ngx.log(ngx.ERR, "DEBUG - EXTRACTED API_KEY: [", api_key, "] ENDPOINT: [", endpoint_path, "]")

-- Ensure path starts without slash for key normalization
if not endpoint_path then endpoint_path = "" end
if endpoint_path:sub(1,1) == "/" then
    endpoint_path = endpoint_path:sub(2)
end

local ip = ngx.var.remote_addr
local now = ngx.now()

-- Default fallback values
local capacity   = 50
local refill_rate = 5

-- Fetch dynamic config from Redis: ratelimit:{apiKey}:{path}
if api_key and api_key ~= "" then
    local config_key = "ratelimit:" .. api_key .. ":" .. endpoint_path
    local data, err2 = red:hmget(config_key, "capacity", "refill_rate")
    if data and data[1] ~= ngx.null and data[2] ~= ngx.null then
        capacity    = tonumber(data[1]) or capacity
        refill_rate = tonumber(data[2]) or refill_rate
        ngx.log(ngx.INFO, "Loaded rate limit config from Redis: ", config_key,
                " capacity=", capacity, " refill_rate=", refill_rate)
    else
        ngx.log(ngx.INFO, "No Redis config found for: ", config_key, ", using defaults")
    end
end

-- Token bucket key per IP + apiKey + path
local bucket_key = "bucket:" .. (api_key or "default") .. ":" .. endpoint_path .. ":" .. ip

-- Redis Lua Script (Atomic Token Bucket)
local script = [[
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refill_rate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])

local data = redis.call("HMGET", key, "tokens", "last_time")
local tokens = tonumber(data[1])
local last_time = tonumber(data[2])

if not tokens then
    tokens = capacity
    last_time = now
end

local delta = math.max(0, now - last_time)
tokens = math.min(capacity, tokens + refill_rate * delta)

if tokens < 1 then
    return -1
end

tokens = tokens - 1

redis.call("HMSET", key,
    "tokens", tokens,
    "last_time", now
)

redis.call("EXPIRE", key, 3600)

return tokens
]]

local res, err3 = red:eval(script, 1, bucket_key, capacity, refill_rate, now)

if not res then
    ngx.log(ngx.ERR, "Redis eval failed: ", err3)
    return ngx.exit(500)
end

if res == -1 then
    ngx.log(ngx.WARN, "Rate limit exceeded for IP: ", ip, " key: ", bucket_key)
    return ngx.exit(429)
end

if api_key and api_key ~= "" then
    local origin, err2 = red:get("tenant:" .. api_key .. ":origin")
    ngx.log(ngx.ERR, "DEBUG - REDIS ORIGIN FOR ", api_key, " IS: ", tostring(origin))

    if not origin or origin == ngx.null then
        ngx.log(ngx.ERR, "Unknown apiKey or target not configured for: ", api_key)
        return ngx.exit(404)
    end
    
    local target = origin .. "/" .. tostring(ngx.var.endpoint_path)
    ngx.log(ngx.ERR, "DEBUG - SETTING NGINX TARGET VAR TO: ", target)
    ngx.var.target_url = target
end

red:set_keepalive(10000, 100)