

Game.Glyph = function(properties) {
    // Instantiate properties to default if they weren't passed
    properties = properties || {};
	this._char = properties['character'] || ' ';
    this._foreground = properties['foreground'] || 'white';
    this._background = properties['background'] || 'black';
};


Game.Glyph.prototype.getChar = function(){ 
    return this._char; 
}
Game.Glyph.prototype.getBackground = function(){
    return this._background;
}
Game.Glyph.prototype.getForeground = function(){ 
    return this._foreground; 
}


Game.Chars = {};

Game.Chars.SingleArrows = ['→','↗','↑','↖','←','↙','↓','↘']
Game.Chars.DoubleArrows = ['⇒','⇗','⇑','⇖','⇐','⇙','⇓','⇘']
Game.Chars.OutlineArrows = ['⇨','⬀','⇧','⬁','⇦','⬃','','']
Game.Chars.SolidArrows = ['➡','⬈','⬆','⬉','⬅','⬋','⬇','⬊']
