import {StrictMode} from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './components/app/app';
import {BrowserRouter} from 'react-router-dom';
import {Provider} from 'react-redux';
import {store} from './store';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import * as dayjs from 'dayjs';
import 'dayjs/locale/ru';
import 'pdfjs-dist/build/pdf.worker.entry.js';

dayjs.locale('ru');

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <Provider store={store}>
      <ToastContainer />
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
