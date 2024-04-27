Java.perform(function() {
    const httpClients = Java.use('com.signallab.lib.utils.net.HttpClients');
    const Exception = Java.use('java.lang.Exception');
    const Log = Java.use('android.util.Log');

	 const decode = httpClients.decode.overload('[B', 'long');
	 const encode = httpClients.encode.overload('[B');
    const getUrlConnection = httpClients.getUrlConnection.overload('java.lang.String', 'java.util.Map');
	 const readStream = httpClients.readStream.overload('java.io.InputStream');
	 const load = httpClients.load.overload('java.lang.String');
    const request = httpClients.request.overload('java.lang.String', 'java.util.Map', '[B', 'java.lang.String');
	 const read = httpClients.read.overload('[B');
	 const save = httpClients.save.overload('java.lang.String', '[B');

	 httpClients.decode.implementation = function(bArr, j7)
	 {
        console.log("appel de decode - arguments :");
        console.log("decode, bArr avant : " + hexlify(bArr));
        console.log("j7 : " + j7);

        const decode_ptr = Module.getExportByName('libchannel.so', 'Java_com_signallab_lib_utils_net_HttpClients_decode');

        Interceptor.attach(decode_ptr, {
		      onEnter: function(args) {
				    var param_3 = args[2];
				    var param_4 = args[3];
				    console.log("Entering into native side of HttpClients::decode");
				    console.log("param_4 : " + parseInt(param_4));
            },
		      onLeave: function(retval) {
				    console.log("End of native side of HttpClients::decode");
				    Interceptor.detachAll();
		      }
        });

        decode.call(this, bArr, j7);

        console.log("decode, bArr apres : " + stringify(bArr));
        console.log("appel de decode - pile d'appel :");
        console.log(stackTraceHere());
	 };

	 httpClients.encode.implementation = function(bArr)
	 {
        console.log("appel de encode - arguments :");
        console.log("encode, bArr avant : " + stringify(bArr));

        var result = encode.call(this, bArr);

        console.log("encode, bArr apres : " + hexlify(bArr));
        console.log("appel de encode - résultat : " + result);
        console.log("appel de encode - pile d'appel :");
        console.log(stackTraceHere());
        
        return result;
	 };

	 httpClients.request.implementation = function(str, map, bArr, str2)
	 {
        console.log("appel de request - arguments :");
        console.log("request, str : " + str);
        console.log("request, map : ") + printMap(map);
        console.log("request, bArr : " + hexlify(bArr) + " (" + stringify(bArr) + ")");
        console.log("request, str2 : " + str2 + " (" + hexlify(str2) + ")");

        var result = request.call(this, str, map, bArr, str2);

        console.log("\nappel de request (Url : " + str + " ), résultat : \n" + result);
        console.log("appel de request - pile d'appel :");
        console.log(stackTraceHere());

        return result;
	 };

	 function hexlify(bArr)
	 {
        if (bArr == null)
        {
            return "nothing !";
        }

        var str = "";
        var x;
        var y;
        for (var i = 0; i < bArr.length; i++)
        {
            x = bArr[i];

            if (x < 0)
            	x += 256;

            y = x.toString(16);
            
            if (y.length == 1)
            	y = '0' + y;

            str += y;
            str += ' ';
        }
        
        return str;
	 };

	 function stringify(bArr)
	 {
        if (bArr == null)
        {
            return "null!";
        }

        var str = "";
        for (var i = 0; i < bArr.length; i++)
        {
            str += (String.fromCharCode(bArr[i]));
        }
        
        return str;
	 };

	 function printMap(map)
	 {
        if (map != null) {
            var keys = map.keySet();
            var iterator = keys.iterator();
            while (iterator.hasNext()) {
                var k = iterator.next();
                console.log("\t" + k + " : " + map.get(k));
            }
        }
	 }

    function stackTraceHere() {
        return Log.getStackTraceString(Exception.$new());
    }
});
