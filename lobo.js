if (typeof window == 'undefined' || window === null) {
  require('prelude-ls').installPrelude(global);
} else {
  prelude.installPrelude(window);
}
(function(){
  var viclib, box2d, $, THREE, v3, spr, bind, vec, person, last_tick, tick, particle, proc;
  viclib = require('viclib')();
  box2d = require('box2d');
  $ = require('boxes');
  THREE = require('three');
  v3 = require('victhree').v3;
  window.vectors = [];
  spr = {
    bre: 0.2,
    hea: 0,
    el1: 0.8,
    el2: 0.86,
    hn1: 0.75,
    hn2: 0.75,
    kn1: 0.8,
    kn2: 0.86,
    ft1: 0.75,
    ft2: 0.75
  };
  bind = function(a, b){
    a.bounds.push({
      vector: b,
      pos: b.pos.clone().sub(a.pos)
    });
    return b.bounds.push({
      vector: a,
      pos: a.pos.clone().sub(b.pos)
    });
  };
  vec = function(x, y){
    var vec;
    vec = {
      pos: v3(x, y, 0),
      vel: v3(0, 0, 0),
      bounds: [],
      locked: false
    };
    vectors.push(vec);
    return vec;
  };
  person = function(){
    var head, breast, lelbow, relbow, lhand, rhand, pelvis, lknee, rknee, lfoot, rfoot, i$, ref$, len$, v;
    head = vec(0, -25);
    breast = vec(0, -15);
    lelbow = vec(-5, -5);
    relbow = vec(5, -5);
    lhand = vec(-5, 5);
    rhand = vec(5, 5);
    pelvis = vec(0, 0);
    lknee = vec(-5, 15);
    rknee = vec(5, 15);
    lfoot = vec(-5, 30);
    rfoot = vec(5, 30);
    for (i$ = 0, len$ = (ref$ = [head, breast, lelbow, relbow, lhand, rhand, pelvis, lknee, rknee, lfoot, rfoot]).length; i$ < len$; ++i$) {
      v = ref$[i$];
      v.pos.add(v3(200, 200, 0));
    }
    bind(head, breast);
    bind(breast, lelbow);
    bind(breast, relbow);
    bind(breast, pelvis);
    bind(lelbow, lhand);
    bind(relbow, rhand);
    bind(pelvis, rknee);
    bind(pelvis, lknee);
    bind(lknee, lfoot);
    return bind(rknee, rfoot);
  };
  last_tick = Date.now();
  tick = function(){
    var dt, i$, ref$, len$, a, j$, ref1$, len1$, bound, b, b_to_a, stable_b_pos;
    dt = (Date.now() - last_tick) / 1000;
    last_tick = Date.now();
    for (i$ = 0, len$ = (ref$ = vectors).length; i$ < len$; ++i$) {
      a = ref$[i$];
      a.pos.add(a.vel.clone().multiplyScalar(dt));
      a.pos.z += 1;
      for (j$ = 0, len1$ = (ref1$ = a.bounds).length; j$ < len1$; ++j$) {
        bound = ref1$[j$];
        b = bound.vector;
        b_to_a = a.pos.clone().sub(b.pos).normalize();
        stable_b_pos = a.pos.clone().add(b_to_a.multiplyScalar(-bound.dist));
        b.pos = stable_b_pos;
      }
      a.vel.multiplyScalar(Math.pow(0.7, dt));
      vectors[0].pos.add(v3(mousex, mousey, 0).clone().sub(vectors[0].pos).normalize().multiplyScalar(5 * dt));
      vectors[0].vel = v3(0, 0, 0);
    }
    return setTimeout(tick, 15);
  };
  particle = mixin(function(){
    return {
      pos: v3(0, 0, 0),
      bounds: []
    };
  });
  proc = processing(800, 600, function(){
    var i$, ref$, len$, a, lresult$, j$, ref1$, len1$, bound, b, results$ = [];
    this.background(240, 240, 240);
    this.strokeWeight(3);
    for (i$ = 0, len$ = (ref$ = vectors).length; i$ < len$; ++i$) {
      a = ref$[i$];
      lresult$ = [];
      for (j$ = 0, len1$ = (ref1$ = a.bounds).length; j$ < len1$; ++j$) {
        bound = ref1$[j$];
        b = bound.vector;
        if (a.pos != null && b.pos != null) {
          lresult$.push(this.line(a.pos.x, a.pos.y, b.pos.x, b.pos.y));
        }
      }
      results$.push(lresult$);
    }
    return results$;
  });
  proc.css('border', "1px solid black");
  $("body").append(proc);
  person();
  tick();
}).call(this);
