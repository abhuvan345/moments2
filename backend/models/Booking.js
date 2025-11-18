const { db } = require("../config/firebase");

class Booking {
  static collection = db.collection("bookings");

  static async create(data) {
    const bookingData = {
      userId: data.userId,
      providerId: data.providerId,
      serviceId: data.serviceId,
      eventType: data.eventType || "",
      date: data.date,
      dates: data.dates || (data.date ? [data.date] : []), // Support multiple dates
      time: data.time,
      guestCount: data.guestCount || 0,
      status: "pending", // pending, confirmed, completed, cancelled
      notes: data.notes || "",
      totalPrice: data.totalPrice || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await this.collection.add(bookingData);
    return { id: docRef.id, ...bookingData };
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

  static async getByUserId(userId) {
    const snapshot = await this.collection
      .where("userId", "==", userId)
      .orderBy("createdAt", "desc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  static async getByProviderId(providerId) {
    const snapshot = await this.collection
      .where("providerId", "==", providerId)
      .orderBy("createdAt", "desc")
      .get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  static async getAll() {
    const snapshot = await this.collection.orderBy("createdAt", "desc").get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  static async updateStatus(id, status) {
    return this.update(id, { status });
  }
}

module.exports = Booking;
