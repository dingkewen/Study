//this is a test
function pushStack(elems){
	var ret = JQuery.merge(this.constructor(),elems);
		ret.prevObject = this;
		ret.context = this.context;
		return ret;
}
//merge
function merge(){
	
}