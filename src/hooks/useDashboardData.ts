import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Product, SaleEntry } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

export function useWholesalerProducts(wholesalerId: string | undefined) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wholesalerId) return;

    const q = query(
      collection(db, 'products'),
      where('sellerId', '==', wholesalerId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(productList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'products');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [wholesalerId]);

  return { products, loading };
}

export function useWholesalerSales(wholesalerId: string | undefined, limitCount?: number) {
  const [sales, setSales] = useState<SaleEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wholesalerId) return;

    let q = query(
      collection(db, 'sales'),
      where('sellerId', '==', wholesalerId),
      orderBy('createdAt', 'desc')
    );

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const salesList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setSales(salesList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'sales');
      setLoading(false);
    });

    return () => unsubscribe();
  }, [wholesalerId, limitCount]);

  return { sales, loading };
}
