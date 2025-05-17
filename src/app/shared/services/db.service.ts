import { DestroyRef, inject, Injectable } from '@angular/core';
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
  onSnapshot,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { BehaviorSubject, catchError, from, map, throwError } from 'rxjs';
import { type Applicant } from '../../features/summary/applicant.model';
import { type Comment } from '../../features/summary/comment.model';

@Injectable({
  providedIn: 'root',
})
export class DbService {
  private destroyRef = inject(DestroyRef);
  private app: FirebaseApp = initializeApp(environment.firebaseConfig);
  private db: Firestore = getFirestore(this.app, this.app.name);
  private applicantsCollection = collection(this.db, 'applicants');
  private commentsCollection = collection(this.db, 'comments');

  comments$ = new BehaviorSubject<Comment[] | undefined>(undefined);

  constructor() {
    const unsubscribeRealtimeCommentsFetch = onSnapshot(
      this.commentsCollection,
      (snapshot) => {
        let fetchedComments: Comment[] = [];
        if (!snapshot.metadata.hasPendingWrites) {
          snapshot.forEach((doc) => {
            const comment = doc.data() as Comment;
            const added = doc.get('added').toDate();
            comment.added = new Date(added).toISOString();
            fetchedComments.push(comment);
          });

          fetchedComments.sort((a, b) => {
            return a.added > b.added ? -1 : 1;
          });

          this.comments$.next(fetchedComments);
        }
      }
    );

    this.destroyRef.onDestroy(() => unsubscribeRealtimeCommentsFetch());
  }

  modifyDocument(document: QueryDocumentSnapshot) {
    let modifiedDoc = {
      ...document.data(),
      id: document.id,
      added: new Date(document.data()['added'].toDate()).toISOString(),
    } as Applicant;
    return modifiedDoc;
  }

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

  getComments(id: string) {
    const querySnapshot = getDocs(this.commentsCollection);
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

  addComment(commentData: { text: string; uid: string }) {
    return from(
      addDoc(this.commentsCollection, {
        ...commentData,
        added: serverTimestamp(),
      })
    ).pipe(
      map((querySnapshot) => querySnapshot.id),
      catchError(() => throwError(() => new Error('failed to add comment')))
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
