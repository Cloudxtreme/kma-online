module.exports = function () {
	var config = {
		mongo_url: getMongoUrl()
	};
	
	return config;
};

function getMongoUrl() {
	switch (process.env.NODE_ENV) {
		case "production":
			return process.env.OPENSHIFT_MONGODB_DB_URL; //"mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/";
		case "waite":
		case "dorff":
			return "mongodb://localhost/kma";
	}
}