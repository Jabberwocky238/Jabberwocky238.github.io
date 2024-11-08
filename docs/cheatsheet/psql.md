创建角色
createuser -s -r jw238

查看角色列表
psql -h localhost -p 5432 -U jw238 -l