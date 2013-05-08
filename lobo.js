if (typeof window == 'undefined' || window === null) {
  require('prelude-ls').installPrelude(global);
} else {
  prelude.installPrelude(window);
}
(function(){
  var viclib, box2d, $, THREE, v3, key, cycle, interpolate, now, arms, Monkey, monkey, last_tick, proc;
  viclib = require('viclib')();
  box2d = require('box2d');
  $ = require('boxes');
  THREE = require('three');
  v3 = require('victhree').v3;
  key = require('key');
  cycle = function(period, stances){
    return function(t){
      var member, ref$, frames, results$ = {};
      for (member in ref$ = stances) {
        frames = ref$[member];
        results$[member] = interpolate(frames, t / period);
      }
      return results$;
    };
  };
  interpolate = function(arr, n){
    var part;
    part = (n % 1) * (arr.length - 1);
    return arr[floor(part)] * (1 - part % 1) + arr[floor(part + 1)] * (part % 1);
  };
  now = function(){
    return Date.now() / 1000;
  };
  arms = [v3(100, 750, 0), v3(150, 720, 0), v3(200, 690, 0), v3(580, 700, 0), v3(630, 670, 0), v3(580, 640, 0), v3(630, 610, 0), v3(730, 200, 0), v3(580, 580, 0), v3(630, 550, 0), v3(580, 520, 0), v3(630, 490, 0), v3(580, 450, 0), v3(630, 420, 0), v3(580, 390, 0), v3(700, 230, 0), v3(200, 200, 0), v3(270, 310, 0), v3(220, 110, 0), v3(100, 50, 0), v3(330, 70, 0), v3(420, 370, 0), v3(320, 350, 0), v3(180, 290, 0), v3(220, 350, 0), v3(120, 360, 0), v3(160, 240, 0), v3(260, 240, 0), v3(460, 240, 0), v3(430, 190, 0), v3(400, 750, 0), v3(360, 770, 0)];
  Monkey = mixin(function(){
    var this$ = this;
    return {
      anatomy: {
        bre: {
          root: 'pel',
          len: 0.17
        },
        hea: {
          root: 'bre',
          len: 0.06
        },
        el1: {
          root: 'bre',
          len: 0.08
        },
        hn1: {
          root: 'el1',
          len: 0.08
        },
        el2: {
          root: 'bre',
          len: 0.08
        },
        hn2: {
          root: 'el2',
          len: 0.08
        },
        kn1: {
          root: 'pel',
          len: 0.08
        },
        ft1: {
          root: 'kn1',
          len: 0.08
        },
        kn2: {
          root: 'pel',
          len: 0.08
        },
        ft2: {
          root: 'kn2',
          len: 0.08
        }
      },
      climb: cycle(3, {
        bre: [0.3, 0.4, 0.7, 0.9, 1.4, 1.8, 1.8, 1.6, 1.2, 0.8, 0.3],
        hea: [0.4, 0.4, 0.7, 1.0, 1.5, 1.9, 1.9, 1.7, 1.2, 0.8, 0.4],
        el1: [0.0, 0.2, 0.6, 0.9, 1.0, 1.7, 1.0, 0.9, 0.9, 0.3, 0.0],
        hn1: [0.5, 0.6, 0.8, 1.0, 1.1, 1.6, 1.4, 1.1, 1.0, 0.7, 0.5],
        el2: [0.0, 0.2, 0.6, 0.9, 1.0, 1.8, 1.3, 1.2, 0.9, 0.4, 0.0],
        hn2: [0.5, 0.6, 0.8, 1.0, 1.2, 1.6, 1.5, 1.2, 0.9, 0.7, 0.5],
        kn1: [3.0, 2.8, 2.8, 2.7, 3.3, 5.0, 4.8, 4.5, 3.8, 3.4, 3.0],
        ft1: [2.5, 2.3, 2.0, 2.2, 3.2, 4.5, 4.8, 4.4, 3.7, 3.2, 2.5],
        kn2: [2.7, 2.7, 2.8, 2.8, 3.8, 4.5, 4.7, 4.5, 3.4, 3.0, 2.7],
        ft2: [2.3, 2.5, 2.7, 2.7, 3.0, 3.7, 3.7, 3.8, 3.4, 3.0, 2.3]
      }),
      jump: cycle(1, {
        bre: [1.2, 1.2],
        hea: [1.2, 1.2],
        el1: [0.3, 0.3],
        hn1: [0.5, 0.5],
        el2: [0.5, 0.5],
        hn2: [0.7, 0.7],
        kn1: [3.8, 3.8],
        ft1: [3.8, 3.8],
        kn2: [3.7, 3.7],
        ft2: [2.7, 2.7]
      }),
      pos: v3(100, 700, 0),
      vel: v3(0, 0, 0),
      fixed: void 8,
      tick: function(dt){
        var cycle, member, ref$, ang, ds;
        this$.pts = {
          pel: {
            root: void 8,
            pos: v3(0, 0, 0)
          }
        };
        cycle = this$.fixed != null
          ? this$.climb
          : this$.jump;
        for (member in ref$ = cycle(now())) {
          ang = ref$[member];
          this$.pts[member] = {
            pos: v3(cos(ang * tau / 4), -sin(ang * tau / 4), 0).multiplyScalar(this$.anatomy[member].len * 150).add(this$.pts[this$.anatomy[member].root].pos),
            root: this$.pts[this$.anatomy[member].root]
          };
        }
        if (this$.fixed) {
          ds = this$.fixed.pos.clone().sub(this$.pts[this$.fixed.pivot].pos);
          each(function(it){
            return it.pos.add(ds);
          }, this$.pts);
          this$.vel = this$.pts.pel.pos.clone().sub(this$.pos).multiplyScalar(1.65);
          this$.pos = this$.pts.pel.pos;
        } else {
          this$.vel.add(v3(0, 3 * dt, 0));
          this$.pos.add(this$.vel);
          each(function(it){
            return it.pos.add(this$.pos);
          }, this$.pts);
          each(function(it){
            return this$.fixed = {
              pos: it,
              pivot: 'hn1'
            };
          })(
          filter(function(it){
            return it !== this$.last_arm || it === arms[0];
          })(
          filter(function(it){
            return this$.pts.hn1.pos.distanceTo(it) < 22;
          })(
          arms)));
        }
        if (this$.pos.y > 900) {
          this$.pos = v3(100, 700, 0);
          return this$.vel = v3(0, 0, 0);
        }
      },
      draw: function(proc){
        proc.arc(this$.pts.hea.pos.x, this$.pts.hea.pos.y, 9, 9, 0, tau);
        return each(function(it){
          return proc.line(it.pos.x, it.pos.y, it.root.pos.x, it.root.pos.y);
        })(
        filter(function(it){
          return it.root != null;
        })(
        this$.pts));
      }
    };
  });
  monkey = Monkey();
  key.press('space', function(){
    return monkey.fixed = void 8;
  });
  last_tick = now();
  proc = processing(800, 800, function(){
    var dt, this$ = this;
    dt = now() - last_tick;
    last_tick = now();
    this.background(240, 240, 240);
    this.strokeWeight(3);
    monkey.tick(dt);
    monkey.draw(this);
    return each(function(it){
      return this$.rect(it.x, it.y, 5, 5);
    }, arms);
  });
  proc.css('border', "1px solid black");
  $("body").append(proc);
}).call(this);
