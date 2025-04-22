import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCustomersAPI } from "../../services/chatServices";
import { useSelector } from "react-redux";

const VendorChat = () => {
  const navigate = useNavigate();
  const vendorId=useSelector((state)=>state.user.id)
  // Fetch customers using React Query
  const { 
    data: vendors, 
    isLoading, 
    isError, 
    error 
  } = useQuery({
    queryKey: ['customers'],
    queryFn: getCustomersAPI,
    onError: (err) => console.error("Failed to fetch customers:", err),
    select: (data) => {
      console.log(data);
      
      return data?.map(customer => ({
        id: customer.id,
        name: customer.username || `Customer ${customer._id?.substring(0, 5)}`,
        lastMessage: customer?.lastMessage || "No messages yet",
        time: customer.lastMessage?.timestamp 
          ? new Date(customer.lastMessage.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })
          : "",
        unread: customer.unreadCount > 0,
        avatar: customer.avatar
      })) || [];
    }
  });
console.log(vendors);

  const handleVendorClick = (userId) => {
    navigate(`/chat/${userId}/${vendorId}`);
  };

  // Styles
  const styles = {
    container: {
      maxWidth: "800px",
      margin: "2rem auto",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f7f8fa",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
    },
    vendorList: {
      maxHeight: "calc(100vh - 200px)",
      overflowY: "auto",
      padding: "1rem",
    },
    vendorItem: {
      display: "flex",
      padding: "12px",
      borderBottom: "1px solid #e9edef",
      cursor: "pointer",
      backgroundColor: "white",
      borderRadius: "8px",
      marginBottom: "8px",
      transition: "background-color 0.2s ease",
    },
    vendorItemHover: {
      backgroundColor: "#f5f5f5",
    },
    vendorAvatar: {
      width: "50px",
      height: "50px",
      borderRadius: "50%",
      backgroundColor: "#075e54",
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginRight: "12px",
      fontSize: "20px",
      backgroundSize: "cover",
      backgroundPosition: "center",
    },
    vendorDetails: {
      flex: 1,
      minWidth: 0,
    },
    vendorNameTime: {
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "4px",
    },
    vendorName: {
      margin: 0,
      fontSize: "16px",
      fontWeight: "600",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    time: {
      fontSize: "12px",
      color: "#667781",
    },
    lastMessage: {
      margin: 0,
      fontSize: "14px",
      color: "#667781",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },
    unreadBadge: {
      width: "10px",
      height: "10px",
      backgroundColor: "#25d366",
      borderRadius: "50%",
      alignSelf: "center",
      marginLeft: "10px",
    },
    unreadText: {
      fontWeight: "bold",
      color: "#111b21",
    },
    loadingIndicator: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100px",
    },
    errorMessage: {
      color: "red",
      padding: "20px",
      textAlign: "center",
    },
  };

  if (isLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Chats</h1>
        </div>
        <div style={styles.loadingIndicator}>Loading conversations...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.headerTitle}>Chats</h1>
        </div>
        <div style={styles.errorMessage}>
          Error loading conversations: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.vendorList}>
        {vendors.map((vendor) => (
          <div
            key={vendor.id}
            style={{
              ...styles.vendorItem,
              ...(vendor.unread && styles.unreadText),
            }}
            onClick={() => handleVendorClick(vendor.id)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = styles.vendorItemHover.backgroundColor;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = styles.vendorItem.backgroundColor;
            }}
          >
            <div 
              style={{ 
                ...styles.vendorAvatar,
                backgroundImage: vendor.avatar ? `url(${vendor.avatar})` : undefined
              }}
            >
              {!vendor.avatar && <span>{vendor.name.charAt(0)}</span>}
            </div>
            <div style={styles.vendorDetails}>
              <div style={styles.vendorNameTime}>
                <h3 style={{ ...styles.vendorName, ...(vendor.unread && styles.unreadText) }}>
                  {vendor.name}
                </h3>
                {vendor.time && <span style={styles.time}>{vendor.time}</span>}
              </div>
              <p style={{ ...styles.lastMessage, ...(vendor.unread && styles.unreadText) }}>
                {vendor.lastMessage}
              </p>
            </div>
            {vendor.unread && <div style={styles.unreadBadge}></div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorChat;