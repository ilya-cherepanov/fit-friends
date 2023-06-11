import {useEffect, useRef} from 'react';
import {Modal} from '../modal/modal';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {Location} from '@fit-friends/core';
import {LocationCoords, LocationRu} from '../../constants';

interface MapModalProps {
  onClose: () => void;
  location: Location;
  isUserMap?: boolean;
}

export function MapModal({onClose, location, isUserMap = false}: MapModalProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current) {
      return;
    }
    if (map.current) {
      return;
    }

    map.current = L.map(mapContainer.current, {
      center: [...LocationCoords[location]],
      zoom: 13,
    });
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map.current);
    const icon = L.divIcon({
      html: isUserMap ? `
      <svg aria-hidden="true" width="99" height="71" viewBox="0 0 42 51"><g fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M40.437 16.4067C35.8909 -4.11976 6.13237 -4.14347 1.56306 16.383C-1.10431 28.424 6.22515 40.2464 12.6268 46.5513C17.3121 51.1496 24.688 51.1496 29.3501 46.5513C35.7749 40.2464 43.1044 28.4477 40.437 16.4067Z" fill="#333333" stroke="#C5EC2A"/><path d="M21 23.7805C23.4303 23.7805 25.4004 21.8149 25.4004 19.3902C25.4004 16.9656 23.4303 15 21 15C18.5697 15 16.5996 16.9656 16.5996 19.3902C16.5996 21.8149 18.5697 23.7805 21 23.7805Z" fill="#C5EC2A"/><path d="M21 25.9756C16.5908 25.9756 13 28.9259 13 32.561C13 32.8068 13.1936 33 13.44 33H28.56C28.8064 33 29 32.8068 29 32.561C29 28.9259 25.4092 25.9756 21 25.9756Z" fill="#C5EC2A"/></g></svg>
    ` : `
      <svg aria-hidden="true" width="99" height="71" viewBox="50 0 50 72"><g fill="none"><path fill-rule="evenodd" clip-rule="evenodd" d="M68.437 16.4067C63.8909 -4.11976 34.1324 -4.14347 29.5631 16.383C26.8957 28.424 34.2252 40.2464 40.6268 46.5513C45.3121 51.1496 52.688 51.1496 57.3501 46.5513C63.7749 40.2464 71.1044 28.4477 68.437 16.4067Z" fill="#333333" stroke="#C5EC2A"/><path d="M52.2231 20C51.1591 20 49.8898 20.3852 49.8898 22.2222V25.7778C49.8898 27.6148 51.1591 28 52.2231 28C53.2871 28 54.5564 27.6148 54.5564 25.7778V22.2222C54.5564 20.3852 53.2871 20 52.2231 20Z" fill="#C5EC2A"/><path d="M45.7769 20C44.7129 20 43.4436 20.3852 43.4436 22.2222V25.7778C43.4436 27.6148 44.7129 28 45.7769 28C46.8409 28 48.1102 27.6148 48.1102 25.7778V22.2222C48.1102 20.3852 46.8409 20 45.7769 20Z" fill="#C5EC2A"/><path d="M49.8898 23.5556H48.1102V24.4444H49.8898V23.5556Z" fill="#C5EC2A"/><path d="M55.5333 25.9259C55.2782 25.9259 55.0667 25.7244 55.0667 25.4815V22.5185C55.0667 22.2756 55.2782 22.0741 55.5333 22.0741C55.7884 22.0741 56 22.2756 56 22.5185V25.4815C56 25.7244 55.7884 25.9259 55.5333 25.9259Z" fill="#C5EC2A"/><path d="M42.4667 25.9259C42.2116 25.9259 42 25.7244 42 25.4815V22.5185C42 22.2756 42.2116 22.0741 42.4667 22.0741C42.7218 22.0741 42.9333 22.2756 42.9333 22.5185V25.4815C42.9333 25.7244 42.7218 25.9259 42.4667 25.9259Z" fill="#C5EC2A"/></g></svg>
    `,
    });
    L.marker([...LocationCoords[location]], {icon: icon}).addTo(map.current);
  }, [isUserMap]);

  return (
    <Modal title={LocationRu[location]} onClose={onClose} classModifier="map">
      <div className="popup__map" style={{height: 632}} ref={mapContainer}>
      </div>
    </Modal>
  );
}
