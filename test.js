// jquey method for Internal Standard Introduction
//test
//栈操作
function pushStack(elems){
	var ret = JQuery.merge(this.constructor(),elems);
		ret.prevObject = this;
		ret.context = this.context;
		return ret;
}
//merge
//伪数组 数组{0：a,1:b,length:2}
function merge(first,second){
		
		var l = second.length,
			i = first.length,
			j = 0;

		if ( typeof l === "number" ) {
			for ( ; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		} else {
			//内部使用 
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
		
}