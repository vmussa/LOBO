require! {viclib:viclib(), box2d:box2d, $:boxes, THREE:three, v3:victhree.v3}

window.vectors = []

spr =
	bre: 0.2
	hea: 0
	el1: 0.8
	el2: 0.86
	hn1: 0.75
	hn2: 0.75
	kn1: 0.8
	kn2: 0.86
	ft1: 0.75
	ft2: 0.75

bind = (a,b) ->
	a.bounds.push({vector:b, pos:b.pos.clone().sub(a.pos)})
	b.bounds.push({vector:a, pos:a.pos.clone().sub(b.pos)})

vec = (x,y) ->
	vec = 
		pos: v3(x,y,0)
		vel: v3(0,0,0)
		bounds: []
		locked: false
	vectors.push vec
	vec

person = -> 
	head = vec(0,-25)

	breast = vec(0,-15)
	lelbow = vec(-5,-5)
	relbow = vec(5,-5)

	lhand = vec(-5,5)
	rhand = vec(5,5)

	pelvis = vec(0,0)

	lknee = vec(-5,15)
	rknee = vec(5,15)

	lfoot = vec(-5,30)
	rfoot = vec(5,30)

	for v in [head, breast, lelbow, relbow, lhand, rhand, pelvis, lknee, rknee, lfoot, rfoot]
		v.pos.add(v3(200,200,0))
	bind(head,breast)
	
	bind(breast,lelbow)
	bind(breast,relbow)
	bind(breast,pelvis)

	bind(lelbow,lhand)
	bind(relbow,rhand)

	bind(pelvis,rknee)
	bind(pelvis,lknee)

	bind(lknee,lfoot)
	bind(rknee,rfoot)


last_tick = Date.now!
tick = ->
	dt = (Date.now! - last_tick) / 1000
	last_tick := Date.now!

	for a in vectors
		a.pos.add(a.vel.clone().multiplyScalar(dt))
		a.pos.z += 1
		#a.vel.add(v3(0,1,0))
		#log a.pos
		for bound in a.bounds
			b = bound.vector
			b_to_a = a.pos.clone().sub(b.pos).normalize()
			stable_b_pos = a.pos.clone().add(b_to_a.multiplyScalar(-bound.dist))
			#ds = stable_b_pos.clone().sub(b.pos)
			#b.vel.add(ds)
			b.pos = stable_b_pos


			#if (b.pos.distanceTo(a.pos) < bound.dist) then
				#b.vel.!k!

			#force = ds.multiplyScalar(1)
			#b.vel.add(force)
			#log a.pos.clone().sub(b.pos).length() - bound.dist
			#if Math.abs(a.pos.clone().sub(b.pos).length() - bound.dist) > 1 then
				#b.vel = a.pos.clone().sub(b.pos).multiplyScalar(0.1)

		a.vel.multiplyScalar(Math.pow(0.7,dt)) #kinetic energy loss

		vectors[0].pos.add(v3(mousex,mousey,0).clone().sub(vectors[0].pos).normalize().multiplyScalar(5*dt))
		vectors[0].vel = v3(0,0,0)
		#vectors[0]
			#..pos = v3(mousex,mousey,0)
			#..vel = v3(0,0,0)

	setTimeout tick, 15

particle = mixin ->
	pos: v3(0,0,0)
	bounds: []

proc = processing 800, 600, ->
	@background 240 240 240
	@strokeWeight 3
	for a in vectors
		#@arc a.pos.x, a.pos.y, 12, 12, 0, tau
		for bound in a.bounds
			b = bound.vector
			if (a.pos? && b.pos?) then
				@line a.pos.x, a.pos.y, b.pos.x, b.pos.y
proc.css \border "1px solid black"
$("body").append proc

person!
tick!
#lobo!


# engine física: box2d.js, no idea how to use that shit
# a lib carrega de boa. pra ver o conteudo dela: \/

