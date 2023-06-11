import {Modal} from '../modal/modal';
import {TrainingResponse} from '@fit-friends/shared-types';
import {BACKEND_STATIC_URL} from '../../constants';
import {QuantityField} from '../quantity-field/quantity-field';
import {MouseEventHandler, useState} from 'react';
import {OrderPaymentMethod, OrderTrainingCount, OrderType} from '@fit-friends/core';
import {PaymentMethod} from '../payment-method/payment-method';
import {useCreateOrderMutation} from '../../store/features/orders/orders.api';


interface BuyTrainingModalProps {
  onClose: () => void;
  training: TrainingResponse;
}

export function BuyTrainingModal({onClose, training}: BuyTrainingModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<OrderPaymentMethod | null>(null);
  const [createOrder, {isLoading}] = useCreateOrderMutation();

  const handleClickBuy: MouseEventHandler<HTMLButtonElement> = async (evt) => {
    evt.preventDefault();
    if (!paymentMethod) {
      return;
    }

    await createOrder({
      quantity,
      paymentMethod,
      type: OrderType.Training,
      id: training.id
    }).unwrap();
    onClose();
  };

  return (
    <Modal title="Купить тренировку" onClose={onClose} classModifier="purchases">
      <>
        <div className="popup__product">
          <div className="popup__product-image">
            <picture>
              <img src={`${BACKEND_STATIC_URL}/${training.image}`} width="98" height="80" alt=""/>
            </picture>
          </div>
          <div className="popup__product-info">
            <h3 className="popup__product-title">{training.title.toLowerCase()}</h3>
            <p className="popup__product-price">${training.price} ₽</p>
          </div>
          <div className="popup__product-quantity">
            <p className="popup__quantity">Количество</p>
            <QuantityField value={quantity} onChange={setQuantity} min={OrderTrainingCount.Min} max={OrderTrainingCount.Max} />
          </div>
        </div>
        <PaymentMethod value={paymentMethod} onChange={setPaymentMethod} />
        <div className="popup__total">
          <p className="popup__total-text">Итого</p>
          <svg className="popup__total-dash" width="310" height="2" aria-hidden="true">
            <use xlinkHref="#dash-line"></use>
          </svg>
          <p className="popup__total-price">{quantity * training.price} ₽</p>
        </div>
        <div className="popup__button">
          <button className="btn" type="button" onClick={handleClickBuy} disabled={paymentMethod === null || isLoading}>Купить</button>
        </div>
      </>
    </Modal>
  );
}
