#!/bin/bash

lat=$(dig @8.8.8.8 | grep "Query time:" | grep -Po '(\d)+')
echo "Google DNS (8.8.8.8): $lat ms"

#lat=$(dig @9.9.9.9 | grep "Query time:" | grep -Po '(\d)+')
#echo "Quad9 DNS (9.9.9.9): $lat ms"
#
#lat=$(dig @1.1.1.1 | grep "Query time:" | grep -Po '(\d)+')
#echo "CloudFlare (1.1.1.1): $lat ms"
#
#lat=$(dig @208.67.222.222 | grep "Query time:" | grep -Po '(\d)+')
#echo "OpenDNS (208.67.222.222): $lat ms"
#
#lat=$(dig @77.88.8.7 | grep "Query time:" | grep -Po '(\d)+')
#echo "Yandex (77.88.8.7): $lat ms"
#
#lat=$(dig @83.169.186.161 | grep "Query time:" | grep -Po '(\d)+')
#echo "Vodafone (83.169.186.161): $lat ms"

#echo ""

lat=$(dig @127.0.0.1 | grep "Query time:" | grep -Po '(\d)+')
echo "localhost (127.0.0.1): $lat ms"

echo ""