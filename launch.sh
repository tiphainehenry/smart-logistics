gnome-terminal --geometry=150x50 --tab --title="front" -e "bash -c \"cd client && npm start;exec bash\"" --tab --title="ganache" -e "bash -c \"ganache-cli -m \"east enjoy keen nut hat debris blur trophy alone steak large federal\" -l 8000000;exec bash\""  --tab --title="truffle" -e "bash -c \"truffle migrate;exec bash\"" --tab --title="bridge" -e "bash -c \"npm run bridge;exec bash\""
