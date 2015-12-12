/**
 * Created by William on 27/09/2015.
 */
// Initialize Phaser, and create a 2520x1400px game
var config = {
    width: 2520,
    height: 1400,
    renderer: Phaser.AUTO,
    parent: 'war',
    forceSetTimeOut: true
};
var game = new Phaser.Game(config);
//var game = new Phaser.Game(2520, 1400, Phaser.AUTO, 'war');

game.state.add('Boot', War.Boot);
game.state.add('Load', War.Load);
game.state.add('Menu', War.Menu);
game.state.add('Game', War.Game);

game.state.start('Boot');