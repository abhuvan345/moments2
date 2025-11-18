const { db } = require("../config/firebase");

class Provider {
  static collection = db.collection("providers");

  static async create(data) {
    const providerData = {
      uid: data.uid,
      businessName: data.businessName,
      description: data.description || "",
      category: data.category,
      location: data.location || "",
      phone: data.phone,
      email: data.email,
      avatar: data.avatar || "",
      images: data.images || [],
      rating: 0,
      reviewCount: 0,
      status: "pending", // pending, approved, rejected
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await this.collection.add(providerData);
    return { id: docRef.id, ...providerData };
  }

  static async findById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
    return { id: doc.id, ...doc.data() };
  }

  static async findByUid(uid) {
    const snapshot = await this.collection.where("uid", "==", uid).get();
    if (snapshot.empty) {
      return null;
    }
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }

  static async update(id, data) {
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    await this.collection.doc(id).update(updateData);
    return this.findById(id);
  }

  static async delete(id) {
    await this.collection.doc(id).delete();
    return { success: true };
  }

  static async getAll(filters = {}) {
    let query = this.collection;

    if (filters.status) {
      query = query.where("status", "==", filters.status);
    }

    if (filters.category) {
      query = query.where("category", "==", filters.category);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  static async updateStatus(id, status) {
    return this.update(id, { status });
  }
}

module.exports = Provider;
