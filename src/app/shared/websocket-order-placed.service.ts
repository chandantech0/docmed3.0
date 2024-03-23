import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import * as env from '../../environments/environment.prod';
@Injectable({
  providedIn: 'root'
})
export class WebsocketOrderPlacedService {
  private socket: Socket;

  constructor() {
    const envProd = env.environment;
    this.socket = io(envProd.apiBaseUrl); // Replace with your server URL
  }

  placeOrder(orderData: any): void {
    this.socket.emit('placeOrder', orderData);
  }

  getNewOrder(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('newOrder', (data) => {
        observer.next(data);
      });
    });
  }
}
