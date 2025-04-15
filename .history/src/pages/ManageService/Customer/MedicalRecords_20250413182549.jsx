import React, { useState, useEffect } from 'react';
import MainLayout from '../../../layouts/MainLayout';
import { Card, CardContent } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { UserCircle, Plus } from 'lucide-react';
import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const MedicalRecords = () => {
  const [careRecipients, setCareRecipients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCareRecipients = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/careRecipient/customer`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.data && response.data.data) {
          setCareRecipients(response.data.data);
        }
      } catch (err) {
        console.error('Error fetching care recipients:', err);
        setError(err.response?.data?.message || 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchCareRecipients();
  }, []);

  const getGenderLabel = (gender) => {
    return gender === 'FEMALE' ? 'Nữ' : 'Nam';
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-semibold font-['SVN-Gilroy']">Hồ sơ người bệnh</h1>
          <button className="flex items-center gap-2 bg-[#00A86B] text-white px-4 py-2 rounded-lg hover:bg-[#008F5D] transition-colors">
            <Plus size={20} />
            <span>Thêm hồ sơ mới</span>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A86B]"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : careRecipients.length === 0 ? (
          <div className="text-center py-12">
            <UserCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Chưa có hồ sơ người bệnh</h3>
            <p className="text-gray-500 mb-4">Bạn chưa thêm hồ sơ người bệnh nào</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {careRecipients.map((recipient) => (
              <Card 
                key={recipient.careRecipientId}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 rounded-full bg-[#00A86B]/10 flex items-center justify-center flex-shrink-0">
                      <UserCircle className="w-8 h-8 text-[#00A86B]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{recipient.name}</h3>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="bg-[#00A86B]/10 text-[#00A86B] border-none">
                            {getGenderLabel(recipient.gender)}
                          </Badge>
                          <Badge variant="outline" className="bg-[#00A86B]/10 text-[#00A86B] border-none">
                            {recipient.yearOld} tuổi
                          </Badge>
                        </div>
                        {recipient.specialDetail && (
                          <p className="text-gray-600 text-sm">
                            <span className="font-semibold">Ghi chú:</span> {recipient.specialDetail}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MedicalRecords; 