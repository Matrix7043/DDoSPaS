local ip = ngx.var.remote_addr
local dict = ngx.shared.ip_store

local capacity = 100
local refill_rate = 10 -- tokens per second

local now = ngx.now()

local data = dict:get(ip)

local tokens
local last_time

if data then
	tokens, last_time = data:match("([^,]+),([^,]+)")
	tokens = tonumber(tokens)
	last_time = tonumber(last_time)
else
	tokens = capacity
	last_time = now
end

-- calculate new tokens based on time passed
local delta = now - last_time
tokens = math.min(capacity, tokens + delta * refill_rate)

if tokens < 1 then
	ngx.status = 429
	return ngx.exit(429)
end

-- consume token
tokens = tokens - 1

-- save updated state
dict:set(ip, tokens .. "," .. now)
