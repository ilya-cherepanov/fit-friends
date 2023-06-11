import {GymResponse} from '@fit-friends/shared-types';
import {Modal} from '../modal/modal';
import {BACKEND_STATIC_URL, GymParameterRu} from '../../constants';
import {QuantityField} from '../quantity-field/quantity-field';
import {PaymentMethod} from '../payment-method/payment-method';
import {MouseEventHandler, useState} from 'react';
import {OrderPaymentMethod, OrderType} from '@fit-friends/core';
import {useCreateOrderMutation} from '../../store/features/orders/orders.api';


interface SubscribeGymModalProps {
  onClose: () => void;
  gym: GymResponse;
}


export function SubscribeGymModal({gym, onClose}: SubscribeGymModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<null | OrderPaymentMethod>(null);
  const [createOrder, {isLoading}] = useCreateOrderMutation();

  const handleBuyClick: MouseEventHandler<HTMLButtonElement> = async (evt) => {
    evt.preventDefault();
    if (!paymentMethod) {
      return;
    }

    await createOrder({
      quantity,
      type: OrderType.Subscription,
      id: gym.id,
      paymentMethod,
    }).unwrap();
    onClose();
  };

  return (
    <Modal title="Оформить абонемент" onClose={onClose} classModifier="membership">
      <>
        <div className="popup__product">
          <div className="popup__product-image">
            <picture>
              <img src={`${BACKEND_STATIC_URL}/${gym.photos[0]}`} width="98" height="80" alt=""/>
            </picture>
          </div>
          <div className="popup__product-info">
            <h3 className="popup__product-title">{gym.title}</h3>
            <p className="popup__product-price">{gym.price} ₽</p>
          </div>
          <div className="popup__product-quantity">
            <p className="popup__quantity">Количество</p>
            <QuantityField value={quantity} onChange={setQuantity}/>
          </div>
        </div>
        <section className="services-check">
          <h4 className="services-check__title">Дополнительные услуги (1000 ₽)</h4>
          <ul className="services-check__list">
            {gym.parameters.map((parameter) => (
              <li key={parameter} className="services-check__item">
                <div className="custom-toggle custom-toggle--checkbox">
                  <label>
                    <input type="checkbox" name="parameters" value={parameter}/><span
                    className="custom-toggle__icon">
                      <svg width="9" height="6" aria-hidden="true">
                        <use xlinkHref="#arrow-check"></use>
                      </svg></span><span className="custom-toggle__label">{GymParameterRu[parameter]}</span>
                  </label>
                </div>
              </li>
            ))}
          </ul>
        </section>
        <PaymentMethod value={paymentMethod} onChange={setPaymentMethod}/>
        <div className="popup__total">
          <p className="popup__total-text">Итого</p>
          <svg className="popup__total-dash" width="310" height="2" aria-hidden="true">
            <use xlinkHref="#dash-line"></use>
          </svg>
          <div>
            <p className="popup__total-price">{quantity * gym.price} ₽</p>
          </div>
        </div>
        <div className="popup__button">
          <button className="btn" type="button" disabled={isLoading || paymentMethod === null} onClick={handleBuyClick}>Купить</button>
        </div>
      </>
    </Modal>
  );
}
