/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

System.register(["test/lib/common","app/core/core"],function(a,b){"use strict";var c,d;b&&b.id;return{setters:[function(a){c=a},function(a){d=a}],execute:function(){c.describe("Emitter",function(){c.describe("given 2 subscribers",function(){c.it("should notfiy subscribers",function(){var a=new d.Emitter,b=!1,e=!1;a.on("test",function(){b=!0}),a.on("test",function(){e=!0}),a.emit("test",null),c.expect(b).to.be(!0),c.expect(e).to.be(!0)}),c.it("when subscribing twice",function(){function a(){e+=1}var b=new d.Emitter,e=0;b.on("test",a),b.on("test",a),b.emit("test",null),c.expect(e).to.be(2)}),c.it("should handle errors",function(){var a=new d.Emitter,b=0,e=0;a.on("test",function(){throw b++,"hello"}),a.on("test",function(){e++});try{a.emit("test",null)}catch(a){}try{a.emit("test",null)}catch(a){}c.expect(b).to.be(2),c.expect(e).to.be(0)})})})}}});