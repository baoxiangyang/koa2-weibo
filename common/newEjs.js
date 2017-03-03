module.exports = async function(ctx, path, obj){
	ctx.state = Object.assign({
		user:null, 
    local:false, 
    data:[]
	}, ctx.state, obj);
	console.log(ctx.state);
	await ctx.render(path);
};