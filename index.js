module.exports =
{
	"Cache": require("./lib/cache"),
	"CacheProviders":
	{
		"Disk": require("./lib/cache_providers/disk"),
		"Memory": require("./lib/cache_providers/memory"),
		"Redis": require("./lib/cache_providers/redis")
	}
};
