#!/bin/bash

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PYTHON="$DIR/homedecor_env/bin/python3"

echo "🏠 Starting Maison Home Decor..."
echo ""

# Kill any existing instances
echo "⏹  Stopping any previous servers..."
pkill -f "manage.py runserver" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 1

# Start Django backend
echo "🔧 Starting Django backend on http://localhost:8000 ..."
nohup bash -c "cd '$DIR/backend' && '$PYTHON' manage.py runserver 8000" > /tmp/maison_django.log 2>&1 &
DJANGO_PID=$!
sleep 2

# Start React frontend
echo "🎨 Starting React frontend on http://localhost:5173 ..."
nohup bash -c "cd '$DIR/frontend' && npm run dev -- --port 5173" > /tmp/maison_vite.log 2>&1 &
VITE_PID=$!
sleep 3

echo ""
echo "✅ Both servers are running!"
echo "   Frontend → http://localhost:5173"
echo "   Backend  → http://localhost:8000"
echo "   Admin    → http://localhost:8000/admin  (admin / admin123)"
echo ""
echo "Logs: /tmp/maison_django.log  |  /tmp/maison_vite.log"
echo ""
echo "Press Ctrl+C to stop both servers."

trap "echo ''; echo '🛑 Stopping servers...'; kill $DJANGO_PID $VITE_PID 2>/dev/null; pkill -f 'manage.py runserver'; pkill -f 'vite'; exit 0" SIGINT SIGTERM
wait
