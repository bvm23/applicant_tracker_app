import { Injectable, signal } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment';
import {
  Firestore,
  getFirestore,
  getDocs,
  collection,
} from 'firebase/firestore';
import { catchError, from, map, Observable, throwError } from 'rxjs';
import { type Applicant } from '../../features/summary/applicant.model';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private app: FirebaseApp = initializeApp(environment.firebaseConfig);
  private db: Firestore = getFirestore(this.app);
  private applicantsCollection = collection(this.db, 'applicants');

  constructor() {}

  getAllData() {
    const querySnapshot = getDocs(this.applicantsCollection);
    return from(querySnapshot).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map(
          (document) =>
            ({
              id: document.id,
              ...document.data(),
              added: new Date(document.data()['added'].toDate()).toISOString(),
            } as Applicant)
        )
      ),
      catchError(() =>
        throwError(() => new Error('failed to load applicant data'))
      )
    );
  }
}
