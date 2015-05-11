var fs = require('fs');

// Note that values are JSON-stringified before insertion to the cache and
// JSON-parsed before extraction from the cache. This is so that references
// aren't passed around that may accidentally corrupt the data in the cache.

var Parse = function(Data) {
	try { return JSON.parse(Data); }
	catch(E) {
		console.error('Corrupt cache');
		return {};
	}
}

module.exports = function(Path)
{
	if(!fs.existsSync(Path)) {
		fs.writeFileSync(Path, JSON.stringify({}));
	}

	this.Get = function(Key, Callback)
	{
		var Cache = Parse(fs.readFileSync(Path));
		var Cached = Cache[Key];
		if (!Cached || Cached.Expiration < Date.now())
		{
			delete Cache[Key];
			return Callback();
		}

		var Value;
		try { Value = Parse(Cached.Value); }
		catch (E) { Value = null; }
		return Callback(null, Value);
	};

	this.Set = function(Key, Value, TTL, Callback)
	{
		var Cache = Parse(fs.readFileSync(Path));
		Callback = Callback || function() {};
		Cache[Key] = { "Expiration": Date.now() + ~~(1000 * TTL), "Value": JSON.stringify(Value) };
		fs.writeFileSync(Path, JSON.stringify(Cache));
		Callback();
	};

	this.Invalidate = function(Key, Callback)
	{
    var Cache = Parse(fs.readFileSync(Path));
		delete Cache[Key];
    fs.writeFileSync(Path, JSON.stringify(Cache));
    Callback = Callback || function() {};
		Callback();
	}
};
