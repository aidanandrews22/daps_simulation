import { collection, getDocs, query, where, doc, getDoc, addDoc, deleteDoc, updateDoc, orderBy, limit, Timestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export const useFirestore = () => {
  const { $firebase } = useNuxtApp()

  const getDocuments = async (collectionName, conditions = [], sortByDate = true) => {
    try {
      console.log($firebase)
      const collectionRef = collection($firebase.firestore, collectionName)
      let queryConstraints = [...conditions]

      if (sortByDate) {
        queryConstraints.push(orderBy('createdAt', 'desc'))
      }

      const q = query(collectionRef, ...queryConstraints)
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    } catch (error) {
      console.error('Error fetching documents:', error)
      return []
    }
  }

  const getDocument = async (collectionName, documentId) => {
    try {
      const docRef = doc($firebase.firestore, collectionName, documentId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      } else {
        console.log('No such document!')
        return null
      }
    } catch (error) {
      console.error('Error fetching document:', error)
      return null
    }
  }

  const addDocument = async (collectionName, data) => {
    try {
      const docData = {
        ...data,
        createdAt: Timestamp.now(),
      }
      const docRef = await addDoc(collection($firebase.firestore, collectionName), docData)
      return docRef.id
    } catch (error) {
      console.error('Error adding document:', error)
      return null
    }
  }

  const updateDocument = async (collectionName, documentId, data) => {
    try {
      const docData = {
        ...data,
        createdAt: Timestamp.now(),
      }
      const docRef = doc($firebase.firestore, collectionName, documentId)
      await updateDoc(docRef, docData)
      return true
    } catch (error) {
      console.error('Error updating document:', error)
      return false
    }
  }

  const deleteDocument = async (collectionName, documentId) => {
    try {
      await deleteDoc(doc($firebase.firestore, collectionName, documentId))
      return true
    } catch (error) {
      console.error('Error deleting document:', error)
      return false
    }
  }

  const uploadImage = async (file, path) => {
    try {
      console.log('Uploading file:', file)
      console.log('Upload path:', path)
      const storageRef = ref($firebase.storage, path)
      const snapshot = await uploadBytes(storageRef, file)
      console.log('Upload successful:', snapshot)
      const downloadURL = await getDownloadURL(snapshot.ref)
      console.log('Download URL:', downloadURL)
      return downloadURL
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  }

  return {
    getDocuments,
    getDocument,
    addDocument,
    updateDocument,
    deleteDocument,
    uploadImage,
  }
}
