# securevpn
Some tools used to analyze secure vpn Android app, and the resulting logs, pcap and so on

- trace_SignalHelper_connect.js : Trace the call to the connect native method. Allows to check which arguments are passed to the native function.

- trace_AesGcm.js : Trace AES_GCM crypto operations.

- decrypt.py : Python script to check that AES_GCM is really used.

- traceHttpClients.js : Trace enrolment process to capture the configuration (VPN servers list)

- instrumentation.py : A script to interact with corellium emulators.

- dissect_securevpn_traffic.py : A script to decrypt a pcap containing traffic "protected" with Secure VPN app.

- *.json : The captured configuration on several devices.

- *.pcap : Some intercepted traffic.
