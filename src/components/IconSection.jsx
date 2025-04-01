import React from 'react';

const IconSection = () => {
    return (
        <div className="icon-section-container">
            <div className="icons-grid">
                <div className="icon-card">
                    <div className="icon-circle">
                        <span className="icon-emoji">🚚</span>
                    </div>
                    <h3>Free Shipping</h3>
                    <p>Free shipping on all orders over $50</p>
                </div>
                <div className="icon-card">
                    <div className="icon-circle">
                        <span className="icon-emoji">🔒</span>
                    </div>
                    <h3>Secure Payment</h3>
                    <p>Encrypted transactions for your security</p>
                </div>
                <div className="icon-card">
                    <div className="icon-circle">
                        <span className="icon-emoji">↩️</span>
                    </div>
                    <h3>Easy Returns</h3>
                    <p>30-day hassle-free return policy</p>
                </div>
                <div className="icon-card">
                    <div className="icon-circle">
                        <span className="icon-emoji">💬</span>
                    </div>
                    <h3>24/7 Support</h3>
                    <p>Support available around the clock</p>
                </div>
            </div>

            <style jsx>{`
                .icon-section-container {
                    width: 100%;
                }
                
                .icons-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 2rem;
                }
                
                .icon-card {
                    background: white;
                    padding: 2rem 1.5rem;
                    border-radius: 16px;
                    text-align: center;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
                }
                
                .icon-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
                }
                
                .icon-circle {
                    width: 80px;
                    height: 80px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #f5f7ff 0%, #ebefff 100%);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 1.5rem;
                    position: relative;
                    transition: all 0.3s ease;
                }
                
                .icon-card:hover .icon-circle {
                    background: linear-gradient(135deg, #ebefff 0%, #e2e6ff 100%);
                    box-shadow: 0 10px 20px rgba(110, 142, 251, 0.15);
                }
                
                .icon-emoji {
                    font-size: 2.5rem;
                    display: block;
                }
                
                .icon-card h3 {
                    color: #333;
                    font-size: 1.3rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }
                
                .icon-card p {
                    color: #666;
                    font-size: 0.95rem;
                    line-height: 1.6;
                }
                
                /* Responsive styles */
                @media (max-width: 992px) {
                    .icons-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }
                
                @media (max-width: 576px) {
                    .icons-grid {
                        grid-template-columns: 1fr;
                    }
                    
                    .icon-card {
                        padding: 1.5rem 1rem;
                    }
                }
            `}</style>
        </div>
    );
};

export default IconSection;
