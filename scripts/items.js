function ItemsGame() {
    var score = 0, timer = 0, standard = true, pro = false, items = 0;
    var inc = 0; //increments for difficulty
    var maxNumItems = 5;	//current difficulty
    var countdown; //timer
    const NUM_BLOCKS = 25, MAX_SIZE = 20, ROW_SIZE = 5;
    const STORAGE_LOCATION = {
        '00':'ItemsTimedHighScore',
        '01':'ItemsTimedProHighScore',
        '10':'ItemsStandardHighScore',
        '11':'ItemsStandardProHighScore'
    };

    this.setStandard = function(isStandard) {
        standard = isStandard;
    };

    this.startNewGame = function(isPro) {
        if (isPro != undefined) pro = isPro;
        if (standard) timer = 3;
        else timer = 60;

        $('#instructions').hide();
        $('#gametype').hide();
        $('#conclusion').hide();
        $('#game').show();
        randomize();
        $('#score').text('Score: ' + score);
        $('#countdown').text('Time Left: ' + timer);

        countdown = setInterval(subtractTime, 1000);

        $('#answer').focus();
    };

    function subtractTime() {
        if (--timer > 0) {
            $('#countdown').text('Time Left: ' + timer);
        } else {
            clearInterval(countdown);
            $('#game').hide();
            $('#result').text('Your Score: ' + score);
            var storageLoc = STORAGE_LOCATION['' + +standard + +pro];
            var highScore = localStorage[storageLoc];
            if (score > highScore || !highScore) {
                localStorage[storageLoc] = score;
                highScore = score;
            }
            $('#highScore').text('High Score: ' + highScore);
            $('#conclusion').show();
            resetGame();
        }
    }

    function randomize() {
        var content = $('#blocks');
        content.empty();
        items = Math.ceil(Math.random()*maxNumItems);
        var listOfPlacedItems = [];

        for (var i=0; i<items; i++) {
            var position;
            do { position = Math.floor(Math.random()*NUM_BLOCKS); } while (listOfPlacedItems.indexOf(position) >= 0);
            listOfPlacedItems.push(position);
            var left = (position%ROW_SIZE)*MAX_SIZE;
            var top = Math.floor(position/ROW_SIZE)*MAX_SIZE;
            var randomSize = 18;
            if (pro) {
                randomSize = Math.floor(Math.random()*14)+5;
                var moreShiftPossibility = MAX_SIZE - randomSize - 2;
                top += Math.floor(Math.random()*moreShiftPossibility);
                left += Math.floor(Math.random()*moreShiftPossibility);
            }
            content.append('<div id=' + i + ' style="left: ' + left + '%; top: ' + top + '%; width: ' + randomSize + '%; height: ' + randomSize + '%;"></div>');
        }
    }

    function resetGame() {
        score = 0;
        inc = 0;
        maxNumItems = 5;
        $('#answer').val('');
    }

    this.answer = function() {
        var answer = parseInt($('#answer').val());
        $('#answer').val('');
        if (answer == items) {
            inc++;
            if (inc%3 == 0 && maxNumItems < 15) maxNumItems++;

            score += 10;
            $('#score').text('Score: ' + score);

            if (standard) {
                clearInterval(countdown);
                timer = 3;
                countdown = setInterval(subtractTime, 1000);
                $('#countdown').text('Time Left: ' + timer);
            }

            randomize();
        } else {
            score -= 5;
            $('#score').text('Score: ' + score);
        }
    };

    this.endGame = function() {
        resetGame();
        clearInterval(countdown);
    };
}

$(function () {
    game = new ItemsGame();

    $('#standard').click(function() {
        $('#instructions').hide();
        $('#gametype').show();
        game.setStandard(true);
    });

    $('#timed').click(function() {
        $('#instructions').hide();
        $('#gametype').show();
        game.setStandard(false);
    });

    $('#normal').click(function() {
        game.startNewGame(false);
    });

    $('#pro').click(function() {
        game.startNewGame(true);
    });

    $('#enter').click(function () {
        game.answer();
        $('#answer').focus();
    });

    $('#answer').keypress(function(e) {
        if (e.which == 13) {
            game.answer();
        }
    });

    $('#highScores').click(function() {
        $('#instructions').hide();
        var standardScore = localStorage.ItemsStandardHighScore;
        if (standardScore) $('#standardScore').text('Standard: ' + standardScore);
        else $('#standardScore').text('Standard: ' + 0);
        var standardScorePro = localStorage.ItemsStandardProHighScore;
        if (standardScorePro) $('#standardScorePro').text('Standard Pro: ' + standardScorePro);
        else $('#standardScorePro').text('Standard Pro: ' + 0);
        var timedScore = localStorage.ItemsTimedHighScore;
        if (timedScore) $('#timedScore').text('Timed Mode: ' + timedScore);
        else $('#timedScore').text('Timed Mode: ' + 0);
        var timedScorePro = localStorage.ItemsTimedProHighScore;
        if (timedScorePro) $('#timedScorePro').text('Timed Mode Pro: ' + timedScorePro);
        else $('#timedScorePro').text('Timed Mode Pro: ' + 0);
        $('#scores').show();
    });

    $('#playAgain').click(function() {
        $('#conclusion').hide();
        game.startNewGame();
    });

    $('#menuBtn').click(function() {
        $('#conclusion').hide();
        $('#instructions').show();
    });

    $('.returnBtn').click(function() {
        $('#scores').hide();
        $('#gametype').hide();
        $('#instructions').show();
    });
});