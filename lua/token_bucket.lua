local redis = require "resty.redis"

local red = redis:new()
red:set_timeout(1000)

local ok, err = red:connect("redis", 6379)
if not ok then
    ngx.log(ngx.ERR, "Redis connection failed: ", err )
    return ngx.exit(500)
end

local ip = ngx.var.remote_addr
local now = ngx.now()

local capacity = 100
local refill_rate = 10

--Redis Lua Script (Atomic)
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

local res, err = red:eval(script, 1, ip, capacity, refill_rate, now)

if not res then
    ngx.log(ngx.ERR, "Redis eval failed: ", err)
    return ngx.exit(500)
end

if res == -1 then
    return ngx.exit(429)
end

red:set_keepalive(10000, 100)