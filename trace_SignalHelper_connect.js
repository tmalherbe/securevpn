Java.perform(function() {
    const signalHelper = Java.use('com.signallab.lib.SignalHelper');
    const Exception = Java.use('java.lang.Exception');
    const Log = Java.use('android.util.Log');

	 const connect = signalHelper.connect.overload('int', 'java.lang.String', '[I', '[I', 'long', 'long', 'java.lang.String', 'boolean', 'int');

    function stackTraceHere() {
        return Log.getStackTraceString(Exception.$new());
    }

    signalHelper.connect.implementation = function(tunfd, host, udpPorts, tcpPorts, userId, userToken, key, supportBt, algo)
    {
        console.log("\nappel de connect - arguments :");
        console.log("tunfd : " + tunfd);
        console.log("host : " + host);
        console.log("udpPorts : " + udpPorts);
        console.log("tcpPorts : " + tcpPorts);
        console.log("userId : " + userId);
        console.log("userToken : " + userToken);
        console.log("key : " + key);	
        console.log("supportBt : " + supportBt);
        console.log("algo : " + algo);

        console.log("\nappel de connect - pile d'appel :");
        console.log(stackTraceHere());

        connect.call(this, tunfd, host, udpPorts, tcpPorts, userId, userToken, key, supportBt, algo);
    };
});
