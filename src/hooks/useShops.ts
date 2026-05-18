import { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreUtils';

export interface Shop {
  id: string;
  name: string;
  businessName: string;
  location: string;
  shopNo: string;
  block: string;
  category: string;
  image: string;
  rating: number;
}

export function useShops() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'wholesaler'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const shopList = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.businessName || data.displayName || 'Unnamed Shop',
          businessName: data.businessName || '',
          location: `${data.block || ''} ${data.shopNo || ''}`.trim() || 'Ham Grounds',
          shopNo: data.shopNo || '',
          block: data.block || '',
          category: data.category || 'General',
          image: data.photoURL || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=2574&auto=format&fit=crop',
          rating: data.rating || 4.5
        };
      });
      setShops(shopList);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'users');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { shops, loading };
}
