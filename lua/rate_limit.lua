local ip = ngx.var.remote_addr
local dict = ngx.shared.ip_store

local req_count = dict:get(ip)

if req_count then
	dict:incr(ip, 1)
else
	dict:set(ip, 1, 10)
end

if dict:get(ip) > 100 then
	ngx.log(ngx.ERR, "Blocker IP: ", ip)
	ngx.status = 429
	return ngx.exit(429)
end
