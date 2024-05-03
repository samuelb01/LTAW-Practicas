//-- SERVIDOR PARA EL CHAT

//-- Importar módulos
const http = require('http');
const express = require('express');
const socketServer = require('socket.io').Server;





//-- Crear el servidor de websockets asociado a un servidor http (previamente creado)
const io = new socketServer(server)