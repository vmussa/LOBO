require! {viclib:viclib(), box2d:box2d, $:boxes, THREE:three, v3:victhree.v3,key}
cycle = (period,stances) ->
	(t) -> {[member,interpolate(frames,t/period)] for member,frames of stances}
interpolate = (arr,n) ->
	part = (n%1)*(arr.length-1)
	arr[floor(part)]*(1 - part%1) + arr[floor(part+1)]*(part%1)
now = -> Date.now!/1000
arms = [v3(100,750,0),v3(150,720,0),v3(200,690,0),v3(580,700,0),v3(630,670,0),v3(580,640,0),v3(630,610,0),v3(730,200,0),
	v3(580,580,0),v3(630,550,0),v3(580,520,0),v3(630,490,0),v3(580,450,0),v3(630,420,0),v3(580,390,0),v3(700,230,0),
	v3(200,200,0),v3(270,310,0),v3(220,110,0),v3(100,50,0),v3(330,70,0),v3(420,370,0),v3(320,350,0),v3(180,290,0),
	v3(220,350,0),v3(120,360,0),v3(160,240,0),v3(260,240,0),v3(460,240,0),v3(430,190,0),v3(400,750,0),v3(360,770,0)]
Monkey = mixin ->
	anatomy:
		bre: root:\pel, len:0.17
		hea: root:\bre, len:0.06
		el1: root:\bre, len:0.08
		hn1: root:\el1, len:0.08
		el2: root:\bre, len:0.08
		hn2: root:\el2, len:0.08
		kn1: root:\pel, len:0.08
		ft1: root:\kn1, len:0.08
		kn2: root:\pel, len:0.08
		ft2: root:\kn2, len:0.08
	#walk: cycle 1,
		#bre: [0.00 0.00 0.00 0.00 0.00]
		#hea: [0.00 0.03 0.00 0.00 0.03]
		#el1: [0.85 0.87 0.75 0.67 0.67]
		#hn1: [0.85 0.72 0.72 0.67 0.63]
		#el2: [0.67 0.67 0.79 0.85 0.85]
		#hn2: [0.63 0.58 0.53 0.62 0.85]
		#kn1: [0.85 0.87 0.75 0.67 0.67]
		#ft1: [0.85 0.72 0.72 0.67 0.63]
		#kn2: [0.67 0.67 0.79 0.85 0.85]
		#ft2: [0.63 0.58 0.53 0.62 0.85]
	climb: cycle 3,
		bre: [0.3 0.4 0.7 0.9 1.4 1.8 1.8 1.6 1.2 0.8 0.3] 
		hea: [0.4 0.4 0.7 1.0 1.5 1.9 1.9 1.7 1.2 0.8 0.4]
		el1: [0.0 0.2 0.6 0.9 1.0 1.7 1.0 0.9 0.9 0.3 0.0]
		hn1: [0.5 0.6 0.8 1.0 1.1 1.6 1.4 1.1 1.0 0.7 0.5]
		el2: [0.0 0.2 0.6 0.9 1.0 1.8 1.3 1.2 0.9 0.4 0.0]
		hn2: [0.5 0.6 0.8 1.0 1.2 1.6 1.5 1.2 0.9 0.7 0.5]
		kn1: [3.0 2.8 2.8 2.7 3.3 5.0 4.8 4.5 3.8 3.4 3.0]
		ft1: [2.5 2.3 2.0 2.2 3.2 4.5 4.8 4.4 3.7 3.2 2.5]
		kn2: [2.7 2.7 2.8 2.8 3.8 4.5 4.7 4.5 3.4 3.0 2.7]
		ft2: [2.3 2.5 2.7 2.7 3.0 3.7 3.7 3.8 3.4 3.0 2.3]
	jump: cycle 1,
		bre: [1.2 1.2]
		hea: [1.2 1.2]
		el1: [0.3 0.3]
		hn1: [0.5 0.5]
		el2: [0.5 0.5]
		hn2: [0.7 0.7]
		kn1: [3.8 3.8]
		ft1: [3.8 3.8]
		kn2: [3.7 3.7]
		ft2: [2.7 2.7]
	pos: v3(100,700,0)
	vel: v3(0,0,0)
	fixed: void
	tick: (dt) ~>
		@pts = pel: root:void, pos:v3(0,0,0)
		cycle = if @fixed? then @climb else @jump
		for member,ang of cycle now!
			@pts[member] = 
				pos:v3(cos(ang*tau/4),-sin(ang*tau/4),0)
					.multiplyScalar(@anatomy[member].len*150)
					.add(@pts[@anatomy[member].root].pos)
				root:@pts[@anatomy[member].root]
		if @fixed then
			ds = @fixed.pos.clone().sub(@pts[@fixed.pivot].pos)
			(->it.pos.add(ds)) `each` @pts
			@vel = @pts.pel.pos.clone().sub(@pos).multiplyScalar(1.65)
			@pos = @pts.pel.pos
		else
			@vel.add(v3(0,3*dt,0))
			@pos.add(@vel)
			(~>it.pos.add @pos) `each` @pts
			arms 	|> filter (~> @pts.hn1.pos.distanceTo(it) < 22)
					|> filter (~> it != @last_arm or it == arms[0])
					|> each (~> @fixed = {pos:it, pivot:\hn1})
		if @pos.y > 900 then
			@pos = v3(100,700,0)
			@vel = v3(0,0,0)
	draw: (proc) ~>
		proc.arc @pts.hea.pos.x, @pts.hea.pos.y, 9, 9, 0, tau
		@pts	|> filter (->it.root?)
				|> each (->proc.line it.pos.x, it.pos.y, it.root.pos.x, it.root.pos.y)
monkey = Monkey!
key.press \space ->
	monkey.fixed = void
last_tick = now!
proc = processing 800, 800, ->
	dt = now! - last_tick
	last_tick := now!
	@background 240 240 240
	@strokeWeight 3
	monkey.tick dt
	monkey.draw @
	(~>@rect it.x, it.y, 5, 5) `each` arms
proc.css \border "1px solid black"
$("body").append proc
