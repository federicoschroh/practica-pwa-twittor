# Twittor
App simple para msj con estrategia de "cache with network fallback"

# Para prueba local
```bash
http-server .
```

```bash
http://localhost:8080
```

# Pruebas

Dentro del navegador (Chrome de preferencia) realizar estas tareas para ver cambios:

> Descativar cache en Network para forzar actualizar el app completo

> Opcion offline en Application/WebWorkers para simular modo offline

> Eliminar cache a mano o actualizar version en código para forzar regitrar nuevo cache


# Debugging remoto
```bash
chrome://inspect/#devices
```

si no aparece el dispositivo conectado hay que revisar linux:

```bash
adb devices
```

si tira algo como esto:
```bash
* daemon not running; starting now at tcp:5037
* daemon started successfully
List of devices attached
MFJVNB4H5LV8DAHY	no permissions (missing udev rules? user is in the plugdev group); see [http://developer.android.com/tools/device.html]
```

entonces hacer esto:
```bash
groups
```

Debe aparecer el grupo `plugdev`

Si no está:
```bash
sudo usermod -aG plugdev $USER 
```
> cerrar sesión y volver a entrar (IMPORTANTE)

## Crear la regla udev

Debemos obtener el id del dispositivo
```bash
lsusb
```
Debería salir algo como
```bash
Bus 003 Device 014: ID 2717:ff08 Xiaomi Inc. Redmi Note 3 (ADB Interface)
```

ejecutar
```bash
sudo nano /etc/udev/rules.d/51-android.rules
```
 
 pegar esto:
 ```bash
 SUBSYSTEM=="usb", ATTR{idVendor}=="2717", MODE="0666", GROUP="plugdev" 
 ```
 aplicar permisos y cambios
 ```bash
 sudo chmod a+r /etc/udev/rules.d/51-android.rules 
 sudo udevadm control --reload-rules
 sudo udevadm trigger
 ```

 reiniciar ADB
 ```bash
 adb kill-server
 adb start-server
 adb devices 
 ```

 y adebería haber saltado popup en el cel para permitir conexion y debería salir algo como esto:
```bash
 MFJVNB4H5LV8DAHY	device
```

si el navegador no deja abrir la url, asegurarse que el diospositivo tenga chrome abierto con alguna página cualquiera. Además si no entra probar con inspect fallback, y si no llega al sitio, entonces se debe ejecutar esto:
```bash
adb reverse tcp:8080 tcp:8080
```

ya con eso se debería visualizar la pagina en el navegador y se debería actualizar en el dispositivo también.