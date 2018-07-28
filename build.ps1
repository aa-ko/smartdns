echo "Building project executables.."
tsc -p .\src\launchers\proxy\tsconfig.json
if(!$?) { exit 1 }
echo "TS -> JS compilation for proxy module successful."

tsc -p .\src\launchers\blocklist\tsconfig.json
if(!$?) { exit 1 }
echo "TS -> JS compilation for blocklist module successful."

nexe .\dist\proxy\launchers\proxy\proxy.js -t x64-8.11.1 -o .\dist\proxy\proxy.exe
nexe .\dist\blocklist\launchers\blocklist\blocklist.js -t x64-8.11.1 -o .\dist\blocklist\blocklist.exe