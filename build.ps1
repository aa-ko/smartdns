echo "Building project executables.."

tsc;
if(!$?) { exit 1 };
echo "TS -> JS compilation successful."

nexe .\dist\launchers\proxy.js -t x64-8.11.1 -o .\dist\proxy.exe
nexe .\dist\launchers\blocklist.js -t x64-8.11.1 -o .\dist\blocklist.exe