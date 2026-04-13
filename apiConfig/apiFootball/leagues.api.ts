fetch("https://v3.football.api-sports.io/leagues", {
	"method": "GET",
	"headers": {
		"x-apisports-key": "09a050219fec11185408523424da15b4"
	}
})
.then(response => {
	console.log(response);
})
.catch(err => {
	console.log(err);
});