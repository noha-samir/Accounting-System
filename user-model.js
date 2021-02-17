var async = require('async');
const { title } = require('process');

var movies = [
    {
        "title": "The Shawshank Redemption",
        "duration": "PT142M",
        "actors": ["Tim Robbins", "Morgan Freeman", "Bob Gunton"],
        "ratings": [],
        "favorites": [66380, 7001, 9250, 34139],
        "watchlist": [15291, 51417, 62289, 6146, 71389, 93707]
    }, {
        "title": "The Godfather",
        "duration": "PT175M",
        "actors": ["Marlon Brando", "Al Pacino", "James Caan"],
        "ratings": [],
        "favorites": [15291, 51417, 7001, 9250, 71389, 93707],
        "watchlist": [62289, 66380, 34139, 6146]
    }, {
        "title": "The Dark Knight",
        "duration": "PT152M",
        "actors": ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
        "ratings": [],
        "favorites": [15291, 7001, 9250, 34139, 93707],
        "watchlist": [51417, 62289, 6146, 71389]
    }, {
        "title": "Pulp Fiction",
        "duration": "PT154M",
        "actors": ["John Travolta", "Uma Thurman", "Samuel L. Jackson"],
        "ratings": [],
        "favorites": [15291, 51417, 62289, 66380, 71389, 93707],
        "watchlist": [7001, 9250, 34139, 6146]
    }
]

var users = [
    {
        "userId": 15291,
        "email": "Constantin_Kuhlman15@yahoo.com",
        "friends": [7001, 51417, 62289]
    }, {
        "userId": 7001,
        "email": "Keven6@gmail.com",
        "friends": [15291, 51417, 62289, 66380]
    }, {
        "userId": 51417,
        "email": "Margaretta82@gmail.com",
        "friends": [15291, 7001, 9250]
    }, {
        "userId": 62289,
        "email": "Marquise.Borer@hotmail.com",
        "friends": [15291, 7001]
    }
]

function User() {
    this.userId = null;
    this.email = null;
    this.friends = [];
}

User.prototype.topFavouriteMoviesAmongFriends = function (finalCallback) {
    let self = this;
    async.waterfall([
        function (callback) {
            //get friends of user
            let index = users.findIndex(x => x.userId == self.userId);
            
            if(index == -1){
                let err = new Error();
                err.message = "Invalid Id";
                callback(err);
            }else{
                let friends = users[index].friends;
                for (let i = 0; i < movies.length; i++) {
                    const movie = movies[i];
                    let movieCounter = 0;
                    for (let j = 0; j < friends.length; j++) {
                        const friend = friends[j];
                        if (movie.favorites.includes(friend)) {
                            movieCounter++;
                        }
                    }
                    movie.counter = movieCounter;
                }
                let sortedArr = movies.sort(function (vote1, vote2) {
                    if (vote1.counter > vote2.counter) return -1;
                    if (vote1.counter < vote2.counter) return 1;
                    if (vote1.title > vote2.title) return 1;
                    if (vote1.title < vote2.title) return -1;
                });
                let first3elements;
                if(sortedArr.length >= 3 ){
                    first3elements = sortedArr.slice(0,3);
                }else{
                    first3elements = sortedArr;
                }
                callback(null,first3elements);
            }
            
        }
    ], function (err, outputArr) {
        finalCallback(err, outputArr);
    });
};

module.exports = User;