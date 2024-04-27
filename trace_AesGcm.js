const gcm_setkey_ptr = Module.getExportByName('libchannel.so', 'gcm_setkey');
const gcm_start_ptr = Module.getExportByName('libchannel.so', 'gcm_start');
const gcm_update_ptr = Module.getExportByName('libchannel.so', 'gcm_update');
const gcm_finish_ptr = Module.getExportByName('libchannel.so', 'gcm_finish');

var gcm_len = -1;
var gcm_mode = -1;
var gcm_output_ptr = null;

function hexlify(addr, len)
{
	var w = Memory.readByteArray((addr), len);
	var x = new Uint8Array(w);
	var y = "";
	var z;

	for (var i = 0; i < x.length; i++)
	{
		  y += "\\x";
		  z = x[i].toString(16);
		  if (z.length == 1)
		  {
		  	  z = "0" + z;
		  }
		  y += z;
	}
	return y;
}

Interceptor.attach(gcm_setkey_ptr, {
    onEnter: function(args) {
        console.log("Entering into gcm_setkey");

		  var key_ptr = args[1];
        var key_len = parseInt(args[2]);

        console.log("gcm_setkey, input : " + hexlify(key_ptr, key_len));
        console.log("gcm_setkey, key_len : " + key_len);
    },
    onLeave: function(retval) {
    }
});

Interceptor.attach(gcm_start_ptr, {
    onEnter: function(args) {
        console.log("Entering into gcm_start");

		  var mode = parseInt(args[1]);
		  var iv_ptr = args[2];
        var iv_len = parseInt(args[3]);

        console.log("gcm_start, mode : " + mode);
        console.log("gcm_start, iv : " + hexlify(iv_ptr, iv_len));
        console.log("gcm_start, iv_len : " + iv_len);
        gcm_mode = mode;
    },
    onLeave: function(retval) {
    }
});

Interceptor.attach(gcm_update_ptr, {
    onEnter: function(args) {
        console.log("Entering into gcm_update");

		  gcm_len = parseInt(args[1]);
		  var gcm_input_ptr = args[2];
        gcm_output_ptr = args[3];

        console.log("gcm_update, input len : " + gcm_len);
        console.log("gcm_update, input : " + hexlify(gcm_input_ptr, gcm_len));
    },
    onLeave: function(retval) {
        console.log("gcm_update, gcm_mode : " + gcm_mode);
        console.log("gcm_update, output after : " + hexlify(gcm_output_ptr, gcm_len));
    }
});

Interceptor.attach(gcm_finish_ptr, {
    onEnter: function(args) {
        console.log("Entering into gcm_finish");

		  var gcm_tag_ptr = args[1];
		  var gcm_tag_len = parseInt(args[2]);

        console.log("gcm_finish, tag ptr : " + gcm_tag_ptr);
        console.log("gcm_finish, tag len : " + gcm_tag_len);
    },
    onLeave: function(retval) {
        /*
        console.log("Stopping script");
        Interceptor.detachAll();
        */
    }
});
