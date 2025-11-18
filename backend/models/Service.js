const { db } = require("../config/firebase");

class Service {
  static collection = db.collection("services");

  static async create(data) {
    const serviceData = {
      providerId: data.providerId,
      name: data.name,
      description: data.description || "",
      category: data.category,
      price: data.price,
      duration: data.duration, // in minutes
      images: data.images || [],
      available: data.available !== false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await this.collection.add(serviceData);
    return { id: docRef.id, ...serviceData };
  }

  static async findById(id) {
    const doc = await this.collection.doc(id).get();
    if (!doc.exists) {
      return null;
    }
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

  static async getByProviderId(providerId) {
    const snapshot = await this.collection
      .where("providerId", "==", providerId)
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  static async getAll(filters = {}) {
    let query = this.collection;

    if (filters.category) {
      query = query.where("category", "==", filters.category);
    }

    if (filters.available !== undefined) {
      query = query.where("available", "==", filters.available);
    }

    const snapshot = await query.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}

module.exports = Service;
