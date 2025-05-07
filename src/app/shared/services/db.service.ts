import { Injectable } from '@angular/core';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment';
import {
  Firestore,
  getFirestore,
  getDocs,
  collection,
  getDoc,
  doc,
  DocumentReference,
  addDoc,
  serverTimestamp,
  deleteDoc,
  updateDoc,
} from 'firebase/firestore';
import { catchError, from, map, throwError } from 'rxjs';
import { type Applicant } from '../../features/summary/applicant.model';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private app: FirebaseApp = initializeApp(environment.firebaseConfig);
  private db: Firestore = getFirestore(this.app, this.app.name);
  private applicantsCollection = collection(this.db, 'applicants');

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
        throwError(() => new Error('failed to load applicants data'))
      )
    );
  }

  get(id: string) {
    const docInfo = doc(this.db, `applicants/${id}`) as DocumentReference;
    const querySnapshot = getDoc(docInfo);
    return from(querySnapshot).pipe(
      map((querySnapshot) => {
        if (querySnapshot.exists()) {
          const data = querySnapshot.data();
          data['id'] = querySnapshot.id;
          data['added'] = new Date(data['added'].toDate()).toISOString();
          return data;
        }
        return {};
      }),
      catchError(() =>
        throwError(() => new Error('failed to load applicant info'))
      )
    );
  }

  add(inputData: Partial<Applicant>) {
    const newApplicantData = { ...inputData, added: serverTimestamp() };
    return from(addDoc(this.applicantsCollection, newApplicantData)).pipe(
      map((querySnapshot) => querySnapshot.id),
      catchError(() => throwError(() => new Error('failed to add applicant')))
    );
  }

  update(id: string, changes: Partial<Applicant>) {
    const docInfo = doc(this.db, `applicants/${id}`);
    return from(updateDoc(docInfo, changes)).pipe(
      catchError(() =>
        throwError(() => new Error('failed to update applicant'))
      )
    );
  }

  delete(id: string) {
    const docInfo = doc(this.db, `applicants/${id}`) as DocumentReference;
    return from(deleteDoc(docInfo)).pipe(
      catchError(() =>
        throwError(() => new Error('failed to delete applicant'))
      )
    );
  }
}
