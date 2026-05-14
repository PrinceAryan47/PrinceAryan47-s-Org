import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

export function useProducts(limitCount?: number) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    if (limitCount) {
      q = query(q, limit(limitCount));
    }

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
  }, [limitCount]);

  return { products, loading };
}
