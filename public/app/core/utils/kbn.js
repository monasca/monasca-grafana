/*! grafana - v4.3.2 - 2017-05-31
 * Copyright (c) 2017 Torkel Ödegaard; Licensed Apache-2.0 */

define(["jquery","lodash"],function(a,b){"use strict";var c={};return c.valueFormats={},c.regexEscape=function(a){return a.replace(/[\\^$*+?.()|[\]{}\/]/g,"\\$&")},c.round_interval=function(a){switch(!0){case a<=15:return 10;case a<=35:return 20;case a<=75:return 50;case a<=150:return 100;case a<=350:return 200;case a<=750:return 500;case a<=1500:return 1e3;case a<=3500:return 2e3;case a<=7500:return 5e3;case a<=12500:return 1e4;case a<=17500:return 15e3;case a<=25e3:return 2e4;case a<=45e3:return 3e4;case a<=9e4:return 6e4;case a<=21e4:return 12e4;case a<=45e4:return 3e5;case a<=75e4:return 6e5;case a<=105e4:return 9e5;case a<=15e5:return 12e5;case a<=27e5:return 18e5;case a<=54e5:return 36e5;case a<=9e6:return 72e5;case a<=162e5:return 108e5;case a<=324e5:return 216e5;case a<=864e5:return 432e5;case a<=1728e5:return 864e5;case a<=6048e5:return 864e5;case a<=18144e5:return 6048e5;case a<36288e5:return 2592e6;default:return 31536e6}},c.secondsToHms=function(a){var b=Math.floor(a/31536e3);if(b)return b+"y";var c=Math.floor(a%31536e3/86400);if(c)return c+"d";var d=Math.floor(a%31536e3%86400/3600);if(d)return d+"h";var e=Math.floor(a%31536e3%86400%3600/60);if(e)return e+"m";var f=Math.floor(a%31536e3%86400%3600%60);if(f)return f+"s";var g=Math.floor(1e3*a);return g?g+"ms":"less then a millisecond"},c.to_percent=function(a,b){return Math.floor(a/b*1e4)/100+"%"},c.addslashes=function(a){return a=a.replace(/\\/g,"\\\\"),a=a.replace(/\'/g,"\\'"),a=a.replace(/\"/g,'\\"'),a=a.replace(/\0/g,"\\0")},c.interval_regex=/(\d+(?:\.\d+)?)(ms|[Mwdhmsy])/,c.intervals_in_seconds={y:31536e3,M:2592e3,w:604800,d:86400,h:3600,m:60,s:1,ms:.001},c.calculateInterval=function(a,b,d){var e,f,g=1;if(d){if(">"!==d[0])return{intervalMs:c.interval_to_ms(d),interval:d};f=d.slice(1),g=c.interval_to_ms(f)}return e=c.round_interval((a.to.valueOf()-a.from.valueOf())/b),g>e&&(e=g),{intervalMs:e,interval:c.secondsToHms(e/1e3)}},c.describe_interval=function(a){var d=a.match(c.interval_regex);if(d&&b.has(c.intervals_in_seconds,d[2]))return{sec:c.intervals_in_seconds[d[2]],type:d[2],count:parseInt(d[1],10)};throw new Error('Invalid interval string, expecting a number followed by one of "Mwdhmsy"')},c.interval_to_ms=function(a){var b=c.describe_interval(a);return 1e3*b.sec*b.count},c.interval_to_seconds=function(a){var b=c.describe_interval(a);return b.sec*b.count},c.query_color_dot=function(a,b){return'<div class="icon-circle" style="'+["display:inline-block","color:"+a,"font-size:"+b+"px"].join(";")+'"></div>'},c.slugifyForUrl=function(a){return a.toLowerCase().replace(/[^\w ]+/g,"").replace(/ +/g,"-")},c.stringToJsRegex=function(a){if("/"!==a[0])return new RegExp("^"+a+"$");var b=a.match(new RegExp("^/(.*?)/(g?i?m?y?)$"));return new RegExp(b[1],b[2])},c.toFixed=function(a,b){if(null===a)return"";var c=b?Math.pow(10,Math.max(0,b)):1,d=String(Math.round(a*c)/c);if(d.indexOf("e")!==-1||0===a)return d;if(null!=b){var e=d.indexOf("."),f=e===-1?0:d.length-e-1;if(f<b)return(f?d:d+".")+String(c).substr(1,b-f)}return d},c.toFixedScaled=function(a,b,d,e,f){return null===d?c.toFixed(a,b)+f:c.toFixed(a,d+e)+f},c.roundValue=function(a,b){if(null===a)return null;var c=Math.pow(10,b);return Math.round((c*a).toFixed(b))/c},c.formatBuilders={},c.formatBuilders.fixedUnit=function(a){return function(b,d){return null===b?"":c.toFixed(b,d)+" "+a}},c.formatBuilders.scaledUnits=function(a,b){return function(d,e,f){if(null===d)return"";for(var g=0,h=b.length;Math.abs(d)>=a;)if(g++,d/=a,g>=h)return"NA";return g>0&&null!==f&&(e=f+3*g),c.toFixed(d,e)+b[g]}},c.formatBuilders.decimalSIPrefix=function(a,b){var d=["n","µ","m","","k","M","G","T","P","E","Z","Y"];d=d.slice(3+(b||0));var e=d.map(function(b){return" "+b+a});return c.formatBuilders.scaledUnits(1e3,e)},c.formatBuilders.binarySIPrefix=function(a,b){var d=["","Ki","Mi","Gi","Ti","Pi","Ei","Zi","Yi"].slice(b),e=d.map(function(b){return" "+b+a});return c.formatBuilders.scaledUnits(1024,e)},c.formatBuilders.currency=function(a){var b=["","K","M","B","T"],d=c.formatBuilders.scaledUnits(1e3,b);return function(b,c,e){if(null===b)return"";var f=d(b,c,e);return a+f}},c.formatBuilders.simpleCountUnit=function(a){var b=["","K","M","B","T"],d=c.formatBuilders.scaledUnits(1e3,b);return function(b,c,e){if(null===b)return"";var f=d(b,c,e);return f+" "+a}},c.valueFormats.none=c.toFixed,c.valueFormats.short=c.formatBuilders.scaledUnits(1e3,[""," K"," Mil"," Bil"," Tri"," Quadr"," Quint"," Sext"," Sept"]),c.valueFormats.dB=c.formatBuilders.fixedUnit("dB"),c.valueFormats.ppm=c.formatBuilders.fixedUnit("ppm"),c.valueFormats.percent=function(a,b){return null===a?"":c.toFixed(a,b)+"%"},c.valueFormats.percentunit=function(a,b){return null===a?"":c.toFixed(100*a,b)+"%"},c.valueFormats.hex=function(a,b){return null==a?"":parseFloat(c.toFixed(a,b)).toString(16).toUpperCase()},c.valueFormats.hex0x=function(a,b){if(null==a)return"";var d=c.valueFormats.hex(a,b);return"-"===d.substring(0,1)?"-0x"+d.substring(1):"0x"+d},c.valueFormats.sci=function(a,b){return a.toExponential(b)},c.valueFormats.currencyUSD=c.formatBuilders.currency("$"),c.valueFormats.currencyGBP=c.formatBuilders.currency("£"),c.valueFormats.currencyEUR=c.formatBuilders.currency("€"),c.valueFormats.currencyJPY=c.formatBuilders.currency("¥"),c.valueFormats.currencyRUB=c.formatBuilders.currency("₽"),c.valueFormats.bits=c.formatBuilders.binarySIPrefix("b"),c.valueFormats.bytes=c.formatBuilders.binarySIPrefix("B"),c.valueFormats.kbytes=c.formatBuilders.binarySIPrefix("B",1),c.valueFormats.mbytes=c.formatBuilders.binarySIPrefix("B",2),c.valueFormats.gbytes=c.formatBuilders.binarySIPrefix("B",3),c.valueFormats.decbits=c.formatBuilders.decimalSIPrefix("b"),c.valueFormats.decbytes=c.formatBuilders.decimalSIPrefix("B"),c.valueFormats.deckbytes=c.formatBuilders.decimalSIPrefix("B",1),c.valueFormats.decmbytes=c.formatBuilders.decimalSIPrefix("B",2),c.valueFormats.decgbytes=c.formatBuilders.decimalSIPrefix("B",3),c.valueFormats.pps=c.formatBuilders.decimalSIPrefix("pps"),c.valueFormats.bps=c.formatBuilders.decimalSIPrefix("bps"),c.valueFormats.Bps=c.formatBuilders.decimalSIPrefix("Bps"),c.valueFormats.KBs=c.formatBuilders.decimalSIPrefix("Bs",1),c.valueFormats.Kbits=c.formatBuilders.decimalSIPrefix("bps",1),c.valueFormats.MBs=c.formatBuilders.decimalSIPrefix("Bs",2),c.valueFormats.Mbits=c.formatBuilders.decimalSIPrefix("bps",2),c.valueFormats.GBs=c.formatBuilders.decimalSIPrefix("Bs",3),c.valueFormats.Gbits=c.formatBuilders.decimalSIPrefix("bps",3),c.valueFormats.ops=c.formatBuilders.simpleCountUnit("ops"),c.valueFormats.rps=c.formatBuilders.simpleCountUnit("rps"),c.valueFormats.wps=c.formatBuilders.simpleCountUnit("wps"),c.valueFormats.iops=c.formatBuilders.simpleCountUnit("iops"),c.valueFormats.opm=c.formatBuilders.simpleCountUnit("opm"),c.valueFormats.rpm=c.formatBuilders.simpleCountUnit("rpm"),c.valueFormats.wpm=c.formatBuilders.simpleCountUnit("wpm"),c.valueFormats.watt=c.formatBuilders.decimalSIPrefix("W"),c.valueFormats.kwatt=c.formatBuilders.decimalSIPrefix("W",1),c.valueFormats.voltamp=c.formatBuilders.decimalSIPrefix("VA"),c.valueFormats.kvoltamp=c.formatBuilders.decimalSIPrefix("VA",1),c.valueFormats.voltampreact=c.formatBuilders.decimalSIPrefix("var"),c.valueFormats.kvoltampreact=c.formatBuilders.decimalSIPrefix("var",1),c.valueFormats.watth=c.formatBuilders.decimalSIPrefix("Wh"),c.valueFormats.kwatth=c.formatBuilders.decimalSIPrefix("Wh",1),c.valueFormats.joule=c.formatBuilders.decimalSIPrefix("J"),c.valueFormats.ev=c.formatBuilders.decimalSIPrefix("eV"),c.valueFormats.amp=c.formatBuilders.decimalSIPrefix("A"),c.valueFormats.kamp=c.formatBuilders.decimalSIPrefix("A",1),c.valueFormats.volt=c.formatBuilders.decimalSIPrefix("V"),c.valueFormats.kvolt=c.formatBuilders.decimalSIPrefix("V",1),c.valueFormats.dBm=c.formatBuilders.decimalSIPrefix("dBm"),c.valueFormats.celsius=c.formatBuilders.fixedUnit("°C"),c.valueFormats.farenheit=c.formatBuilders.fixedUnit("°F"),c.valueFormats.kelvin=c.formatBuilders.fixedUnit("K"),c.valueFormats.humidity=c.formatBuilders.fixedUnit("%H"),c.valueFormats.pressurebar=c.formatBuilders.decimalSIPrefix("bar"),c.valueFormats.pressurembar=c.formatBuilders.decimalSIPrefix("bar",-1),c.valueFormats.pressurekbar=c.formatBuilders.decimalSIPrefix("bar",1),c.valueFormats.pressurehpa=c.formatBuilders.fixedUnit("hPa"),c.valueFormats.pressurehg=c.formatBuilders.fixedUnit('"Hg'),c.valueFormats.pressurepsi=c.formatBuilders.scaledUnits(1e3,[" psi"," ksi"," Mpsi"]),c.valueFormats.forceNm=c.formatBuilders.decimalSIPrefix("Nm"),c.valueFormats.forcekNm=c.formatBuilders.decimalSIPrefix("Nm",1),c.valueFormats.forceN=c.formatBuilders.decimalSIPrefix("N"),c.valueFormats.forcekN=c.formatBuilders.decimalSIPrefix("N",1),c.valueFormats.lengthm=c.formatBuilders.decimalSIPrefix("m"),c.valueFormats.lengthmm=c.formatBuilders.decimalSIPrefix("m",-1),c.valueFormats.lengthkm=c.formatBuilders.decimalSIPrefix("m",1),c.valueFormats.lengthmi=c.formatBuilders.fixedUnit("mi"),c.valueFormats.velocityms=c.formatBuilders.fixedUnit("m/s"),c.valueFormats.velocitykmh=c.formatBuilders.fixedUnit("km/h"),c.valueFormats.velocitymph=c.formatBuilders.fixedUnit("mph"),c.valueFormats.velocityknot=c.formatBuilders.fixedUnit("kn"),c.valueFormats.litre=c.formatBuilders.decimalSIPrefix("L"),c.valueFormats.mlitre=c.formatBuilders.decimalSIPrefix("L",-1),c.valueFormats.m3=c.formatBuilders.decimalSIPrefix("m3"),c.valueFormats.dm3=c.formatBuilders.decimalSIPrefix("dm3"),c.valueFormats.gallons=c.formatBuilders.fixedUnit("gal"),c.valueFormats.flowgpm=c.formatBuilders.fixedUnit("gpm"),c.valueFormats.flowcms=c.formatBuilders.fixedUnit("cms"),c.valueFormats.flowcfs=c.formatBuilders.fixedUnit("cfs"),c.valueFormats.flowcfm=c.formatBuilders.fixedUnit("cfm"),c.valueFormats.hertz=c.formatBuilders.decimalSIPrefix("Hz"),c.valueFormats.ms=function(a,b,d){return null===a?"":Math.abs(a)<1e3?c.toFixed(a,b)+" ms":Math.abs(a)<6e4?c.toFixedScaled(a/1e3,b,d,3," s"):Math.abs(a)<36e5?c.toFixedScaled(a/6e4,b,d,5," min"):Math.abs(a)<864e5?c.toFixedScaled(a/36e5,b,d,7," hour"):Math.abs(a)<31536e6?c.toFixedScaled(a/864e5,b,d,8," day"):c.toFixedScaled(a/31536e6,b,d,10," year")},c.valueFormats.s=function(a,b,d){return null===a?"":Math.abs(a)<1e-6?c.toFixedScaled(1e9*a,b,d-b,-9," ns"):Math.abs(a)<.001?c.toFixedScaled(1e6*a,b,d-b,-6," µs"):Math.abs(a)<1?c.toFixedScaled(1e3*a,b,d-b,-3," ms"):Math.abs(a)<60?c.toFixed(a,b)+" s":Math.abs(a)<3600?c.toFixedScaled(a/60,b,d,1," min"):Math.abs(a)<86400?c.toFixedScaled(a/3600,b,d,4," hour"):Math.abs(a)<604800?c.toFixedScaled(a/86400,b,d,5," day"):Math.abs(a)<31536e3?c.toFixedScaled(a/604800,b,d,6," week"):c.toFixedScaled(a/31556900,b,d,7," year")},c.valueFormats["µs"]=function(a,b,d){return null===a?"":Math.abs(a)<1e3?c.toFixed(a,b)+" µs":Math.abs(a)<1e6?c.toFixedScaled(a/1e3,b,d,3," ms"):c.toFixedScaled(a/1e6,b,d,6," s")},c.valueFormats.ns=function(a,b,d){return null===a?"":Math.abs(a)<1e3?c.toFixed(a,b)+" ns":Math.abs(a)<1e6?c.toFixedScaled(a/1e3,b,d,3," µs"):Math.abs(a)<1e9?c.toFixedScaled(a/1e6,b,d,6," ms"):Math.abs(a)<6e10?c.toFixedScaled(a/1e9,b,d,9," s"):c.toFixedScaled(a/6e10,b,d,12," min")},c.valueFormats.m=function(a,b,d){return null===a?"":Math.abs(a)<60?c.toFixed(a,b)+" min":Math.abs(a)<1440?c.toFixedScaled(a/60,b,d,2," hour"):Math.abs(a)<10080?c.toFixedScaled(a/1440,b,d,3," day"):Math.abs(a)<604800?c.toFixedScaled(a/10080,b,d,4," week"):c.toFixedScaled(a/525948,b,d,5," year")},c.valueFormats.h=function(a,b,d){return null===a?"":Math.abs(a)<24?c.toFixed(a,b)+" hour":Math.abs(a)<168?c.toFixedScaled(a/24,b,d,2," day"):Math.abs(a)<8760?c.toFixedScaled(a/168,b,d,3," week"):c.toFixedScaled(a/8760,b,d,4," year")},c.valueFormats.d=function(a,b,d){return null===a?"":Math.abs(a)<7?c.toFixed(a,b)+" day":Math.abs(a)<365?c.toFixedScaled(a/7,b,d,2," week"):c.toFixedScaled(a/365,b,d,3," year")},c.toDuration=function(a,b,d){if(null===a)return"";if(0===a)return"0 "+d+"s";if(a<0)return c.toDuration(-a,b,d)+" ago";var e=[{short:"y",long:"year"},{short:"M",long:"month"},{short:"w",long:"week"},{short:"d",long:"day"},{short:"h",long:"hour"},{short:"m",long:"minute"},{short:"s",long:"second"},{short:"ms",long:"millisecond"}];a*=1e3*c.intervals_in_seconds[e.find(function(a){return a.long===d}).short];for(var f=[],g=!1,h=0;h<e.length&&b>=0;h++){var i=1e3*c.intervals_in_seconds[e[h].short],j=a/i;if(j>=1||g){g=!0;var k=Math.floor(j),l=e[h].long+(1!==k?"s":"");f.push(k+" "+l),a%=i,b--}}return f.join(", ")},c.valueFormats.dtdurationms=function(a,b){return c.toDuration(a,b,"millisecond")},c.valueFormats.dtdurations=function(a,b){return c.toDuration(a,b,"second")},c.getUnitFormats=function(){return[{text:"none",submenu:[{text:"none",value:"none"},{text:"short",value:"short"},{text:"percent (0-100)",value:"percent"},{text:"percent (0.0-1.0)",value:"percentunit"},{text:"Humidity (%H)",value:"humidity"},{text:"ppm",value:"ppm"},{text:"decibel",value:"dB"},{text:"hexadecimal (0x)",value:"hex0x"},{text:"hexadecimal",value:"hex"},{text:"scientific notation",value:"sci"}]},{text:"currency",submenu:[{text:"Dollars ($)",value:"currencyUSD"},{text:"Pounds (£)",value:"currencyGBP"},{text:"Euro (€)",value:"currencyEUR"},{text:"Yen (¥)",value:"currencyJPY"},{text:"Rubles (₽)",value:"currencyRUB"}]},{text:"time",submenu:[{text:"Hertz (1/s)",value:"hertz"},{text:"nanoseconds (ns)",value:"ns"},{text:"microseconds (µs)",value:"µs"},{text:"milliseconds (ms)",value:"ms"},{text:"seconds (s)",value:"s"},{text:"minutes (m)",value:"m"},{text:"hours (h)",value:"h"},{text:"days (d)",value:"d"},{text:"duration (ms)",value:"dtdurationms"},{text:"duration (s)",value:"dtdurations"}]},{text:"data (IEC)",submenu:[{text:"bits",value:"bits"},{text:"bytes",value:"bytes"},{text:"kibibytes",value:"kbytes"},{text:"mebibytes",value:"mbytes"},{text:"gibibytes",value:"gbytes"}]},{text:"data (Metric)",submenu:[{text:"bits",value:"decbits"},{text:"bytes",value:"decbytes"},{text:"kilobytes",value:"deckbytes"},{text:"megabytes",value:"decmbytes"},{text:"gigabytes",value:"decgbytes"}]},{text:"data rate",submenu:[{text:"packets/sec",value:"pps"},{text:"bits/sec",value:"bps"},{text:"bytes/sec",value:"Bps"},{text:"kilobits/sec",value:"Kbits"},{text:"kilobytes/sec",value:"KBs"},{text:"megabits/sec",value:"Mbits"},{text:"megabytes/sec",value:"MBs"},{text:"gigabytes/sec",value:"GBs"},{text:"gigabits/sec",value:"Gbits"}]},{text:"throughput",submenu:[{text:"ops/sec (ops)",value:"ops"},{text:"reads/sec (rps)",value:"rps"},{text:"writes/sec (wps)",value:"wps"},{text:"I/O ops/sec (iops)",value:"iops"},{text:"ops/min (opm)",value:"opm"},{text:"reads/min (rpm)",value:"rpm"},{text:"writes/min (wpm)",value:"wpm"}]},{text:"length",submenu:[{text:"millimetre (mm)",value:"lengthmm"},{text:"meter (m)",value:"lengthm"},{text:"kilometer (km)",value:"lengthkm"},{text:"mile (mi)",value:"lengthmi"}]},{text:"velocity",submenu:[{text:"m/s",value:"velocityms"},{text:"km/h",value:"velocitykmh"},{text:"mph",value:"velocitymph"},{text:"knot (kn)",value:"velocityknot"}]},{text:"volume",submenu:[{text:"millilitre",value:"mlitre"},{text:"litre",value:"litre"},{text:"cubic metre",value:"m3"},{text:"cubic decimetre",value:"dm3"},{text:"gallons",value:"gallons"}]},{text:"energy",submenu:[{text:"watt (W)",value:"watt"},{text:"kilowatt (kW)",value:"kwatt"},{text:"volt-ampere (VA)",value:"voltamp"},{text:"kilovolt-ampere (kVA)",value:"kvoltamp"},{text:"volt-ampere reactive (var)",value:"voltampreact"},{text:"kilovolt-ampere reactive (kvar)",value:"kvoltampreact"},{text:"watt-hour (Wh)",value:"watth"},{text:"kilowatt-hour (kWh)",value:"kwatth"},{text:"joule (J)",value:"joule"},{text:"electron volt (eV)",value:"ev"},{text:"Ampere (A)",value:"amp"},{text:"Kiloampere (kA)",value:"kamp"},{text:"Volt (V)",value:"volt"},{text:"Kilovolt (kV)",value:"kvolt"},{text:"Decibel-milliwatt (dBm)",value:"dBm"}]},{text:"temperature",submenu:[{text:"Celcius (°C)",value:"celsius"},{text:"Farenheit (°F)",value:"farenheit"},{text:"Kelvin (K)",value:"kelvin"}]},{text:"pressure",submenu:[{text:"Millibars",value:"pressurembar"},{text:"Bars",value:"pressurebar"},{text:"Kilobars",value:"pressurekbar"},{text:"Hectopascals",value:"pressurehpa"},{text:"Inches of mercury",value:"pressurehg"},{text:"PSI",value:"pressurepsi"}]},{text:"force",submenu:[{text:"Newton-meters (Nm)",value:"forceNm"},{text:"Kilonewton-meters (kNm)",value:"forcekNm"},{text:"Newtons (N)",value:"forceN"},{text:"Kilonewtons (kN)",value:"forcekN"}]},{text:"flow",submenu:[{text:"Gallons/min (gpm)",value:"flowgpm"},{text:"Cubic meters/sec (cms)",value:"flowcms"},{text:"Cubic feet/sec (cfs)",value:"flowcfs"},{text:"Cubic feet/min (cfm)",value:"flowcfm"}]}]},c});