/* ******* 8 March Card ******* */
/* ******* @ Serhio Magpie        ******* */

/* serdidg@gmail.com      */
/* http://screensider.com */

var Layout = function(o){
	var that = this,
		config = _.merge({
			'borderWidth' : 15,
			'borderHeight' : 15,
			'bubbleSize' : 24,
			'bubbleSpacing' : 10,
			'colors' : ['#ca6464', '#ee0909', '#4d0404', '#fed6d6', '#bb3ea5', '#ff00d2', '#650955', '#8f09ec', '#cb89f9', '#ddcce9', '#0000ff', '#8c8cf1', '#00006a', '#00ccff', '#e3f9ff', '#50a6bc', '#00fcff', '#00ffb4', '#aefde6', '#0d926b', '#00ff18', '#92f59b', '#e4ffe7', '#43a04b', '#78ff00', '#87bc58', '#3b7805', '#d2ff00', '#edfab0', '#c2cf83', '#fff000', '#faf7c9', '#c1b93d', '#ffb400', '#fdeabd', '#ba9949'],
			'min' : 500,
			'max' : 1000,
			'startMin' : 500,
			'startMax' : 2000,
			'flowerStart' : 2000,
			'flowerDelay' : 150,
			'flowerTime' : 500,
			'flowerColor' : '#bf1646',
			'flowerSize' : 300,
			'petals' : 7,
			'titleStart' : 2000,
			'titleColor' : '#bf1646',
			'letterTime' : 150
		}, o),
		nodes = {
			'border' : null,
			'bubbles' : [],
			'flower' : null,
			'flower_inner' : null,
			'flower_center' : null,
			'flower_blocks' : [],
			'title' : null
		},
		count = config['borderWidth'] * 2 + (config['borderWidth'] - 2) * 2,
		colors = config['colors'].length,
		borderWidth,
		borderHeight,
		borderPos,
		pageSize,
		grad = 360 / config['petals'];
		
	/* Border */
	
	var renderBorder = function(){
		borderWidth = config['borderWidth'] * config['bubbleSize'] + (config['borderWidth']-1) * config['bubbleSpacing'];
		borderHeight = config['borderHeight'] * config['bubbleSize'] + (config['borderHeight']-1) * config['bubbleSpacing'];
		nodes['border'] = document.body.appendChild(_.node('div', {'class':'bubble-border'}));
		nodes['border'].style.width = borderWidth + 'px';
		nodes['border'].style.height = borderHeight + 'px';
		nodes['border'].style.marginTop = - borderHeight/2 + 'px';
		nodes['border'].style.marginLeft = - borderWidth/2 + 'px';
		
		borderPos = _.getOffset(nodes['border']);
		pageSize = _.getPageSize();
		
		for(var i = 0; i < count; i++){
			nodes['bubbles'].push(renderBorderBubble(i));
		}
	};
	
	var renderBorderBubble = function(i){
		var bubble = nodes['border'].appendChild(_.node('div', {'class':'bubble'}));
		bubble.style.width = config['bubbleSize'] + 'px';
		bubble.style.height = config['bubbleSize'] + 'px';
		bubble.style.borderRadius = config['bubbleSize'] + 'px';
		
		var top = 0;
		var left = 0;
		
		if(i < config['borderWidth']){
			bubble.style.top = -(config['bubbleSize'] + borderPos[1]) + 'px';
			bubble.style.left = _.rand2(-borderPos[0], pageSize['width'] - borderPos[0] - config['bubbleSize']) + 'px';
			top = 0;
			left = i * (config['bubbleSize'] + config['bubbleSpacing']); 
		}else if(i < (config['borderWidth']*2) - 2){
			i = i - (config['borderWidth'] - 1);
			bubble.style.top = _.rand2(-borderPos[1], pageSize['height'] - borderPos[1] - config['bubbleSize']) + 'px';
			bubble.style.left =  -(config['bubbleSize'] + borderPos[0]) + 'px';
			top = i * (config['bubbleSize'] + config['bubbleSpacing']);
			left = 0; 
		}else if(i < count-config['borderWidth']){
			i = i - (config['borderWidth']*2 - 3);
			bubble.style.top = _.rand2(-borderPos[1], pageSize['height'] - borderPos[1] - config['bubbleSize']) + 'px';
			bubble.style.left =  pageSize['width'] - borderPos[0] - config['bubbleSize'] + 'px';
			top = i * (config['bubbleSize'] + config['bubbleSpacing']);
			left = borderWidth - config['bubbleSize'];
		}else if(i < count){
			i = i - (count-config['borderWidth']);
			bubble.style.top = pageSize['height'] - borderPos[1] - config['bubbleSize'] + 'px';
			bubble.style.left = _.rand2(-borderPos[0], pageSize['width'] - borderPos[0] - config['bubbleSize']) + 'px';
			top = borderHeight - config['bubbleSize'];
			left = i * (config['bubbleSize'] + config['bubbleSpacing']); 
		}
		
		
		new _.transition({'el' : bubble, 'style':[['background-color', config['colors'][_.rand(0, colors-1)], ''], ['left', left, 'px'], ['top', top, 'px']], 'time': _.rand2(config['startMin'], config['startMax']), 'delay_out' : 0, 'clear' : false, 'onend':function(){
			animateColor(bubble, 'background-color');
		}});
		
		return bubble;
	};
	
	/* Flower */
	
	var renderFlower = function(){
		nodes['flower'] = nodes['border'].appendChild(_.node('div', {'class':'flower'},
			nodes['flower_inner'] = _.node('div', {'class':'inner'},
				nodes['flower_center'] = _.node('div', {'class':'center'})
			)
		));
		nodes['flower'].style.width = config['flowerSize'] + 'px';
		nodes['flower'].style.height = config['flowerSize'] + 'px';
		nodes['flower'].style.top = config['bubbleSize'] + config['bubbleSpacing'] + 'px';
		nodes['flower'].style.left = (borderWidth - config['flowerSize'])/2 + 'px';
		// Center
		var size = config['flowerSize']/5;
		nodes['flower_center'].style.width = size + 'px';
		nodes['flower_center'].style.height = size + 'px';
		nodes['flower_center'].style.borderRadius = size + 'px';
		nodes['flower_center'].style.marginTop = -size/2 + 'px';
		nodes['flower_center'].style.marginLeft = -size/2 + 'px';
		animateFlower(nodes['flower_center'], 0);
		// Blocks
		for(var i = 0; i < config['petals']; i++){
			nodes['flower_blocks'].push(renderFlowerBlock(i));
		}
		// Rotate
		rotateFlower();
	};
	
	var renderFlowerBlock = function(i){
		var g = grad * i,
			block = {};

		block['block'] = nodes['flower_inner'].appendChild(_.node('div', {'class':'block'},
			block['inner'] = _.node('div', {'class':'inner'})
		));
		
		var size = (config['flowerSize'] - config['flowerSize']/5)/3;
		block['inner'].style.width = size + 'px';
		block['inner'].style.height = size + 'px';
		block['inner'].style.top = size/2 + 'px';
		block['inner'].style.left = size/2 + 'px';
		block['inner'].style.borderRadius = size+'px '+size*0.3+'px '+size+'px '+size*0.3+'px';
		
		block['inner'].style.MozTransform = 'rotate(90deg)';
		block['inner'].style.WebkitTransform = 'rotate(90deg)';
		block['inner'].style.OTransform = 'rotate(90deg)';
		block['inner'].style.MsTransform = 'rotate(90deg)';
		block['inner'].style.transform = 'rotate(90deg)';
		
		block['block'].style.MozTransform = 'rotate('+g+'deg)';
		block['block'].style.WebkitTransform = 'rotate('+g+'deg)';
		block['block'].style.OTransform = 'rotate('+g+'deg)';
		block['block'].style.transform = 'rotate('+g+'deg)';
		
		animateFlower(block['inner'], i+1);
		
		return block;
	};
	
	var animateFlower = function(el, i){
		setTimeout(function(){
			new _.transition({'el' : el, 'style':[['background-color', config['flowerColor'], '']], 'time': config['flowerTime']});
		}, config['flowerStart'] + i*config['flowerDelay']);
	};
	
	var rotateFlower = function(){
		setTimeout(function(){
			var r = 0;
			setInterval(function(){
				nodes['flower_inner'].style.MozTransform = 'rotate('+r+'deg)';
				nodes['flower_inner'].style.WebkitTransform = 'rotate('+r+'deg)';
				nodes['flower_inner'].style.OTransform = 'rotate('+r+'deg)';
				nodes['flower_inner'].style.transform = 'rotate('+r+'deg)';
				r += 1;
			}, 33);
		}, config['flowerStartMax']);
	};
	
	/* Title */
	
	var renderTitle = function(text){
		nodes['title'] = nodes['border'].appendChild(_.node('div', {'class':'title'}));
		nodes['title'].style.bottom = config['bubbleSize'] + config['bubbleSpacing'] + 'px';
		
		for(var i = 0, l = text.length; i < l; i++){
			nodes['title'].appendChild(_.node('span', text[i]));
		}
		
		setTimeout(function(){
			animateLetter(text.length, 0);
		}, config['titleStart']);
	};
	
	var animateLetter = function(l, i){
		new _.transition({'el' : nodes['title'].childNodes[i], 'style':[['color', config['titleColor'], '']], 'time': config['letterTime'], 'onend':function(){
			i++;
			if(i <  l){
				animateLetter(l, i);
			}
		}});
	};
	
	/* Fake Flower */
	
	renderFakeFlower = function(){
		nodes['flower'] = nodes['border'].appendChild(_.node('div', {'class':'fake-flower'}));
		nodes['flower'].style.top = config['bubbleSize'] + config['bubbleSpacing'] + 'px';
		nodes['flower'].style.left = (borderWidth - nodes['flower'].offsetWidth) / 2 + 'px';
	};
	
	/* All Fake */
	
	renderAllFake = function(){
		var el = document.createElement('div');
		el.className = 'all-fake';
		document.body.appendChild(el);
	}
		
	/* Main */
	
	var animateColor = function(el, type){
		var c = config['colors'][_.rand(0, colors-1)];

		new _.transition({'el' : el, 'style':[[type, c, '']], 'time': _.rand2(config['min'], config['max']), 'delay_out' : 0, 'clear' : false, 'onend':function(){
			animateColor(el, type);
		}});
	};
	
	var init = function(){
		if(_.IE6 || _.IE7){
			renderAllFake();
		}else{
			// Border
			renderBorder();
			// Flower
			if(_.IE8 || _.IE9){
				renderFakeFlower();
			}else{
				renderFlower();
			}
			// Title
			renderTitle('С 8 Марта!');
		}
	};
	
	init();
};


var Init = function(){
	new Layout();
};

_.addEvent(window, 'load', Init);