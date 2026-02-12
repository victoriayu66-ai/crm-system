```javascript
// 数据存储
let currentUser = null; // 当前登录用户
let users = []; // 用户列表
let customers = [];
let interactions = [];
let opportunities = [];
let currentEditId = null;
let currentEditType = null; // 'customer' or 'opportunity'

// 企业邮箱域名配置
const COMPANY_EMAIL_DOMAIN = '@fengfancloud.com';

// 验证企业邮箱
function isValidCompanyEmail(email) {
    return email.toLowerCase().endsWith(COMPANY_EMAIL_DOMAIN.toLowerCase());
}

// 初始化示例数据
function initializeData() {
    // 初始化用户数据
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
        users = JSON.parse(savedUsers);
    } else {
        // 创建默认管理员账号
        users = [
            {
                id: 1,
                name: '系统管理员',
                email: 'admin@fengfancloud.com',
                password: 'admin123',
                role: 'admin', // admin 或 user
                createdAt: '2026-01-01'
            }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    // 检查登录状态
    const savedCurrentUser = localStorage.getItem('currentUser');
    if (savedCurrentUser) {
        currentUser = JSON.parse(savedCurrentUser);
        showMainSystem();
    } else {
        showAuthPage();
        return;
    }
    
    const savedCustomers = localStorage.getItem('customers');
    const savedInteractions = localStorage.getItem('interactions');
    const savedOpportunities = localStorage.getItem('opportunities');
    
    if (savedCustomers) {
        customers = JSON.parse(savedCustomers);
    } else {
        customers = [
            {
                id: 1,
                name: '张三',
                company: '阿里巴巴',
                email: 'zhangsan@alibaba.com',
                phone: '13800138000',
                source: '网站',
                status: '活跃',
                salesPerson: '王经理,李主管',
                interestedProducts: '企业管理软件,CRM系统',
                notes: '重要客户，需要重点跟进',
                createdBy: 1,
                createdAt: '2026-01-15'
            },
            {
                id: 2,
                name: '李四',
                company: '腾讯科技',
                email: 'lisi@tencent.com',
                phone: '13900139000',
                source: '推荐',
                status: '潜在',
                salesPerson: '张总监',
                interestedProducts: '数据分析平台,商业智能工具',
                notes: '对数据分析产品感兴趣',
                createdBy: 1,
                createdAt: '2026-01-20'
            },
            {
                id: 3,
                name: '王五',
                company: '百度',
                email: 'wangwu@baidu.com',
                phone: '13700137000',
                source: '广告',
                status: '活跃',
                salesPerson: '王经理,赵经理',
                interestedProducts: 'AI解决方案,云计算服务',
                notes: '技术导向型客户',
                createdBy: 1,
                createdAt: '2026-02-01'
            },
            {
                id: 4,
                name: '赵六',
                company: '字节跳动',
                email: 'zhaoliu@bytedance.com',
                phone: '13600136000',
                source: '展会',
                status: '休眠',
                salesPerson: '李主管',
                interestedProducts: '营销自动化工具',
                notes: '暂时没有采购计划',
                createdBy: 1,
                createdAt: '2026-01-10'
            },
            {
                id: 5,
                name: '钱七',
                company: '京东',
                email: 'qianqi@jd.com',
                phone: '13500135000',
                source: '推荐',
                status: '活跃',
                salesPerson: '王经理,李主管,张总监',
                interestedProducts: '供应链管理系统,ERP系统,电商平台',
                notes: '大型企业客户，多部门需求',
                createdBy: 1,
                createdAt: '2026-02-05'
            }
        ];
        localStorage.setItem('customers', JSON.stringify(customers));
    }
    
    if (savedInteractions) {
        interactions = JSON.parse(savedInteractions);
    } else {
        interactions = [
            {
                id: 1,
                customerId: 1,
                customerName: '张三',
                type: '电话',
                content: '讨论了产品需求和预算',
                date: '2026-02-10'
            },
            {
                id: 2,
                customerId: 2,
                customerName: '李四',
                type: '邮件',
                content: '发送了产品介绍资料',
                date: '2026-02-09'
            },
            {
                id: 3,
                customerId: 1,
                customerName: '张三',
                type: '会议',
                content: '产品演示会议',
                date: '2026-02-08'
            },
            {
                id: 4,
                customerId: 3,
                customerName: '王五',
                type: '拜访',
                content: '上门拜访，了解客户需求',
                date: '2026-02-07'
            }
        ];
        localStorage.setItem('interactions', JSON.stringify(interactions));
    }
    
    if (savedOpportunities) {
        opportunities = JSON.parse(savedOpportunities);
    } else {
        opportunities = [
            {
                id: 1,
                customerName: '张三',
                company: '阿里巴巴',
                email: 'zhangsan@alibaba.com',
                phone: '13800138000',
                product: '企业管理软件',
                originalPrice: 100000,
                discount: 10,
                amount: 90000,
                status: '进行中',
                deliveryDays: 30,
                paymentDays: 60,
                notes: '预计下月签约',
                createdBy: 1,
                createdAt: '2026-02-01'
            },
            {
                id: 2,
                customerName: '李四',
                company: '腾讯科技',
                email: 'lisi@tencent.com',
                phone: '13900139000',
                product: '数据分析平台',
                originalPrice: 150000,
                discount: 15,
                amount: 127500,
                status: '已交付',
                deliveryDays: 45,
                paymentDays: 90,
                notes: '已完成交付，等待回款',
                createdBy: 1,
                createdAt: '2026-01-15'
            },
            {
                id: 3,
                customerName: '王五',
                company: '百度',
                email: 'wangwu@baidu.com',
                phone: '13700137000',
                product: 'AI解决方案',
                originalPrice: 200000,
                discount: 0,
                amount: 200000,
                status: '进行中',
                deliveryDays: 60,
                paymentDays: 120,
                notes: '技术方案评审中',
                createdBy: 1,
                createdAt: '2026-02-05'
            },
            {
                id: 4,
                customerName: '钱七',
                company: '京东',
                email: 'qianqi@jd.com',
                phone: '13500135000',
                product: '供应链管理系统',
                originalPrice: 300000,
                discount: 20,
                amount: 240000,
                status: '进行中',
                deliveryDays: 90,
                paymentDays: 180,
                notes: '大型项目，分阶段交付',
                createdBy: 1,
                createdAt: '2026-02-08'
            }
        ];
        localStorage.setItem('opportunities', JSON.stringify(opportunities));
    }
    
    updateDashboard();
    renderCustomers();
}

// 用户认证相关函数
function showAuthPage() {
    document.getElementById('authPage').style.display = 'flex';
    document.getElementById('mainSystem').style.display = 'none';
}

function showMainSystem() {
    document.getElementById('authPage').style.display = 'none';
    document.getElementById('mainSystem').style.display = 'block';
    updateUserInfo();
}

function updateUserInfo() {
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.name;
        document.getElementById('userEmail').textContent = currentUser.email;
        const roleText = currentUser.role === 'admin' ? '管理员' : '普通用户';
        const roleColor = currentUser.role === 'admin' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600';
        document.getElementById('userRole').innerHTML = `<span class="px-2 py-1 rounded text-xs ${roleColor}">${roleText}</span>`;
    }
}

function showLoginForm() {
    document.getElementById('loginForm').style.display = 'block';
    document.getElementById('registerForm').style.display = 'none';
}

function showRegisterForm() {
    document.getElementById('loginForm').style.display = 'none';
    document.getElementById('registerForm').style.display = 'block';
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        alert('请填写邮箱和密码！');
        return;
    }
    
    // 验证企业邮箱
    if (!isValidCompanyEmail(email)) {
        alert('请使用公司企业邮箱（' + COMPANY_EMAIL_DOMAIN + '）登录！');
        return;
    }
    
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainSystem();
        initializeData();
    } else {
        alert('邮箱或密码错误！');
    }
}

function handleRegister() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (!name || !email || !password || !confirmPassword) {
        alert('请填写所有字段！');
        return;
    }
    
    // 验证企业邮箱
    if (!isValidCompanyEmail(email)) {
        alert('请使用公司企业邮箱（' + COMPANY_EMAIL_DOMAIN + '）注册！\n\n示例：zhangsan' + COMPANY_EMAIL_DOMAIN);
        return;
    }
    
    if (password.length < 6) {
        alert('密码至少需要6位！');
        return;
    }
    
    if (password !== confirmPassword) {
        alert('两次输入的密码不一致！');
        return;
    }
    
    if (users.find(u => u.email === email)) {
        alert('该邮箱已被注册！');
        return;
    }
    
    const newUser = {
        id: users.length + 1,
        name: name,
        email: email,
        password: password,
        role: 'user', // 新注册用户默认为普通用户
        createdAt: new Date().toISOString().split('T')[0]
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('注册成功！请登录。');
    showLoginForm();
    
    // 清空表单
    document.getElementById('registerName').value = '';
    document.getElementById('registerEmail').value = '';
    document.getElementById('registerPassword').value = '';
    document.getElementById('registerConfirmPassword').value = '';
}

function handleLogout() {
    if (confirm('确定要退出登录吗？')) {
        currentUser = null;
        localStorage.removeItem('currentUser');
        showAuthPage();
    }
}
```javascript
// 客户查重函数
function checkDuplicateCustomer(email, phone, excludeId = null) {
    // 管理员无需查重
    if (currentUser && currentUser.role === 'admin') {
        return false;
    }
    
    // 普通用户需要查重
    return customers.some(c => {
        if (excludeId && c.id === excludeId) {
            return false; // 编辑时排除自身
        }
        return c.email === email || (phone && c.phone === phone);
    });
}

// 切换页面
function showPage(pageId) {
    const pages = ['dashboard', 'customers', 'interactions', 'opportunities', 'analytics'];
    pages.forEach(page => {
        document.getElementById(page + 'Page').style.display = 'none';
    });
    document.getElementById(pageId + 'Page').style.display = 'block';
    
    // 更新导航按钮状态
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-purple-600', 'text-white');
        btn.classList.add('text-gray-600');
    });
    event.target.closest('.nav-btn').classList.remove('text-gray-600');
    event.target.closest('.nav-btn').classList.add('bg-purple-600', 'text-white');
    
    // 根据页面更新数据
    if (pageId === 'dashboard') {
        updateDashboard();
    } else if (pageId === 'customers') {
        renderCustomers();
    } else if (pageId === 'interactions') {
        renderInteractions();
    } else if (pageId === 'opportunities') {
        renderOpportunities();
    } else if (pageId === 'analytics') {
        renderAnalytics();
    }
}

// 更新仪表盘
function updateDashboard() {
    // 根据用户角色过滤数据
    let filteredCustomers = customers;
    let filteredOpportunities = opportunities;
    let filteredInteractions = interactions;
    
    if (currentUser && currentUser.role !== 'admin') {
        filteredCustomers = customers.filter(c => c.createdBy === currentUser.id);
        filteredOpportunities = opportunities.filter(o => o.createdBy === currentUser.id);
        const customerIds = filteredCustomers.map(c => c.id);
        filteredInteractions = interactions.filter(i => customerIds.includes(i.customerId));
    }
    
    const totalCustomers = filteredCustomers.length;
    const activeCustomers = filteredCustomers.filter(c => c.status === '活跃').length;
    const thisMonthInteractions = filteredInteractions.filter(i => {
        const date = new Date(i.date);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length;
    const totalRevenue = filteredOpportunities.reduce((sum, opp) => sum + opp.amount, 0);
    
    animateNumber('totalCustomers', totalCustomers);
    animateNumber('activeCustomers', activeCustomers);
    animateNumber('monthInteractions', thisMonthInteractions);
    animateNumber('totalRevenue', totalRevenue);
    
    renderCharts();
}

// 数字动画
function animateNumber(elementId, targetNumber) {
    const element = document.getElementById(elementId);
    const duration = 1000;
    const steps = 30;
    const increment = targetNumber / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= targetNumber) {
            current = targetNumber;
            clearInterval(timer);
        }
        
        if (elementId === 'totalRevenue') {
            element.textContent = '¥' + Math.floor(current).toLocaleString();
        } else {
            element.textContent = Math.floor(current);
        }
    }, duration / steps);
}

// 渲染图表
function renderCharts() {
    // 根据用户角色过滤数据
    let filteredCustomers = customers;
    let filteredInteractions = interactions;
    
    if (currentUser && currentUser.role !== 'admin') {
        filteredCustomers = customers.filter(c => c.createdBy === currentUser.id);
        const customerIds = filteredCustomers.map(c => c.id);
        filteredInteractions = interactions.filter(i => customerIds.includes(i.customerId));
    }
    
    // 客户增长趋势图
    const growthChart = echarts.init(document.getElementById('growthChart'));
    const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
    const growthData = [12, 18, 25, 32, 38, filteredCustomers.length];
    
    growthChart.setOption({
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: months,
            axisLine: {
                lineStyle: {
                    color: '#e5e7eb'
                }
            }
        },
        yAxis: {
            type: 'value',
            axisLine: {
                lineStyle: {
                    color: '#e5e7eb'
                }
            }
        },
        series: [{
            data: growthData,
            type: 'line',
            smooth: true,
            itemStyle: {
                color: '#8b5cf6'
            },
            areaStyle: {
                color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                        offset: 0,
                        color: 'rgba(139, 92, 246, 0.3)'
                    }, {
                        offset: 1,
                        color: 'rgba(139, 92, 246, 0.05)'
                    }]
                }
            }
        }]
    });
    
    // 客户来源分布图
    const sourceChart = echarts.init(document.getElementById('sourceChart'));
    const sourceData = [
        { value: filteredCustomers.filter(c => c.source === '网站').length, name: '网站' },
        { value: filteredCustomers.filter(c => c.source === '推荐').length, name: '推荐' },
        { value: filteredCustomers.filter(c => c.source === '广告').length, name: '广告' },
        { value: filteredCustomers.filter(c => c.source === '展会').length, name: '展会' }
    ];
    
    sourceChart.setOption({
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            right: 10,
            top: 'center'
        },
        series: [{
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 16,
                    fontWeight: 'bold'
                }
            },
            data: sourceData,
            color: ['#8b5cf6', '#ec4899', '#f59e0b', '#10b981']
        }]
    });
    
    // 响应窗口大小变化
    window.addEventListener('resize', () => {
        growthChart.resize();
        sourceChart.resize();
    });
}

// 渲染客户列表
function renderCustomers() {
    const searchTerm = document.getElementById('customerSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || 'all';
    const sourceFilter = document.getElementById('sourceFilter')?.value || 'all';
    
    let filteredCustomers = customers.filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(searchTerm) || 
                            customer.company.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
        const matchesSource = sourceFilter === 'all' || customer.source === sourceFilter;
        return matchesSearch && matchesStatus && matchesSource;
    });
    
    // 根据用户角色过滤数据
    if (currentUser && currentUser.role !== 'admin') {
        filteredCustomers = filteredCustomers.filter(c => c.createdBy === currentUser.id);
    }
    
    const tbody = document.getElementById('customerTableBody');
    tbody.innerHTML = '';
    
    filteredCustomers.forEach(customer => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';
        
        // 处理销售负责人
        const salesPersons = customer.salesPerson ? customer.salesPerson.split(/[,、]/).map(p => p.trim()) : [];
        const salesPersonHTML = salesPersons.map(person => 
            `<span class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700 mr-1 mb-1">
                <i class="fas fa-user mr-1"></i>${person}
            </span>`
        ).join('');
        
        // 处理感兴趣的产品
        const products = customer.interestedProducts ? customer.interestedProducts.split(',').map(p => p.trim()) : [];
        const productsHTML = products.map(product => 
            `<span class="inline-block px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 mr-1 mb-1">${product}</span>`
        ).join('');
        
        const statusColors = {
            '活跃': 'bg-green-100 text-green-700',
            '潜在': 'bg-yellow-100 text-yellow-700',
            '休眠': 'bg-gray-100 text-gray-700'
        };
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">${customer.name}</div>
                <div class="text-sm text-gray-500">${customer.company}</div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm text-gray-900">${customer.email}</div>
                <div class="text-sm text-gray-500">${customer.phone}</div>
            </td>
            <td class="px-6 py-4">
                <div class="flex flex-wrap">${salesPersonHTML || '<span class="text-gray-400">未分配</span>'}</div>
            </td>
            <td class="px-6 py-4">
                <div class="flex flex-wrap">${productsHTML || '<span class="text-gray-400">无</span>'}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 rounded-full text-xs ${statusColors[customer.status]}">${customer.status}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${customer.source}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editCustomer(${customer.id})" class="text-indigo-600 hover:text-indigo-900 mr-3">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button onclick="deleteCustomer(${customer.id})" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// 显示添加客户模态框
function showAddCustomerModal() {
    currentEditId = null;
    document.getElementById('customerModalTitle').textContent = '添加客户';
    document.getElementById('customerForm').reset();
    document.getElementById('customerModal').classList.remove('hidden');
}

// 隐藏客户模态框
function hideCustomerModal() {
    document.getElementById('customerModal').classList.add('hidden');
    currentEditId = null;
}

// 编辑客户
function editCustomer(id) {
    const customer = customers.find(c => c.id === id);
    if (!customer) return;
    
    currentEditId = id;
    document.getElementById('customerModalTitle').textContent = '编辑客户';
    document.getElementById('customerName').value = customer.name;
    document.getElementById('customerCompany').value = customer.company;
    document.getElementById('customerEmail').value = customer.email;
    document.getElementById('customerPhone').value = customer.phone;
    document.getElementById('customerSource').value = customer.source;
    document.getElementById('customerStatus').value = customer.status;
    document.getElementById('customerSalesPerson').value = customer.salesPerson || '';
    document.getElementById('customerProducts').value = customer.interestedProducts || '';
    document.getElementById('customerNotes').value = customer.notes;
    
    document.getElementById('customerModal').classList.remove('hidden');
}

// 保存客户
function saveCustomer() {
    const name = document.getElementById('customerName').value.trim();
    const company = document.getElementById('customerCompany').value.trim();
    const email = document.getElementById('customerEmail').value.trim();
    const phone = document.getElementById('customerPhone').value.trim();
    const source = document.getElementById('customerSource').value;
    const status = document.getElementById('customerStatus').value;
    const salesPerson = document.getElementById('customerSalesPerson').value.trim();
    const interestedProducts = document.getElementById('customerProducts').value.trim();
    const notes = document.getElementById('customerNotes').value.trim();
    
    if (!name || !company || !email) {
        alert('请填写必填字段！');
        return;
    }
    
    // 普通用户添加客户时检查查重
    if (checkDuplicateCustomer(email, phone, currentEditId)) {
        alert('该客户已存在（邮箱或电话重复），无法添加！');
        return;
    }
    
    if (currentEditId) {
        // 编辑现有客户
        const customer = customers.find(c => c.id === currentEditId);
        customer.name = name;
        customer.company = company;
        customer.email = email;
        customer.phone = phone;
        customer.source = source;
        customer.status = status;
        customer.salesPerson = salesPerson;
        customer.interestedProducts = interestedProducts;
        customer.notes = notes;
    } else {
        // 添加新客户
        const newCustomer = {
            id: customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1,
            name,
            company,
            email,
            phone,
            source,
            status,
            salesPerson,
            interestedProducts,
            notes,
            createdBy: currentUser.id,
            createdAt: new Date().toISOString().split('T')[0]
        };
        customers.push(newCustomer);
    }
    
    localStorage.setItem('customers', JSON.stringify(customers));
    hideCustomerModal();
    renderCustomers();
    updateDashboard();
}

// 删除客户
function deleteCustomer(id) {
    if (confirm('确定要删除这个客户吗？')) {
        customers = customers.filter(c => c.id !== id);
        localStorage.setItem('customers', JSON.stringify(customers));
        renderCustomers();
        updateDashboard();
    }
}

```javascript
// 渲染交互记录
function renderInteractions() {
    // 根据用户角色过滤数据
    let filteredInteractions = interactions;
    if (currentUser && currentUser.role !== 'admin') {
        const userCustomerIds = customers.filter(c => c.createdBy === currentUser.id).map(c => c.id);
        filteredInteractions = interactions.filter(i => userCustomerIds.includes(i.customerId));
    }
    
    const container = document.getElementById('interactionsList');
    container.innerHTML = '';
    
    filteredInteractions.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(interaction => {
        const div = document.createElement('div');
        div.className = 'glass-effect rounded-xl p-6 card-hover';
        
        const typeIcons = {
            '电话': 'fa-phone',
            '邮件': 'fa-envelope',
            '会议': 'fa-users',
            '拜访': 'fa-handshake'
        };
        
        const typeColors = {
            '电话': 'bg-blue-100 text-blue-700',
            '邮件': 'bg-green-100 text-green-700',
            '会议': 'bg-purple-100 text-purple-700',
            '拜访': 'bg-orange-100 text-orange-700'
        };
        
        div.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 rounded-full ${typeColors[interaction.type]} flex items-center justify-center">
                        <i class="fas ${typeIcons[interaction.type]}"></i>
                    </div>
                    <div>
                        <h3 class="font-semibold text-gray-900">${interaction.customerName}</h3>
                        <p class="text-sm text-gray-600 mt-1">${interaction.content}</p>
                        <p class="text-xs text-gray-400 mt-2">
                            <i class="far fa-calendar mr-1"></i>${interaction.date}
                        </p>
                    </div>
                </div>
                <button onclick="deleteInteraction(${interaction.id})" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        container.appendChild(div);
    });
}

// 显示添加交互记录模态框
function showAddInteractionModal() {
    // 根据用户角色过滤客户选项
    let availableCustomers = customers;
    if (currentUser && currentUser.role !== 'admin') {
        availableCustomers = customers.filter(c => c.createdBy === currentUser.id);
    }
    
    const select = document.getElementById('interactionCustomer');
    select.innerHTML = '<option value="">请选择客户</option>';
    availableCustomers.forEach(customer => {
        const option = document.createElement('option');
        option.value = customer.id;
        option.textContent = `${customer.name} - ${customer.company}`;
        select.appendChild(option);
    });
    
    document.getElementById('interactionForm').reset();
    document.getElementById('interactionModal').classList.remove('hidden');
}

// 隐藏交互记录模态框
function hideInteractionModal() {
    document.getElementById('interactionModal').classList.add('hidden');
}

// 保存交互记录
function saveInteraction() {
    const customerId = parseInt(document.getElementById('interactionCustomer').value);
    const type = document.getElementById('interactionType').value;
    const content = document.getElementById('interactionContent').value.trim();
    const date = document.getElementById('interactionDate').value;
    
    if (!customerId || !type || !content || !date) {
        alert('请填写所有字段！');
        return;
    }
    
    const customer = customers.find(c => c.id === customerId);
    
    const newInteraction = {
        id: interactions.length > 0 ? Math.max(...interactions.map(i => i.id)) + 1 : 1,
        customerId,
        customerName: customer.name,
        type,
        content,
        date
    };
    
    interactions.push(newInteraction);
    localStorage.setItem('interactions', JSON.stringify(interactions));
    
    hideInteractionModal();
    renderInteractions();
    updateDashboard();
}

// 删除交互记录
function deleteInteraction(id) {
    if (confirm('确定要删除这条交互记录吗？')) {
        interactions = interactions.filter(i => i.id !== id);
        localStorage.setItem('interactions', JSON.stringify(interactions));
        renderInteractions();
        updateDashboard();
    }
}

// 渲染商机列表
function renderOpportunities() {
    const searchTerm = document.getElementById('opportunitySearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('opportunityStatusFilter')?.value || 'all';
    const productFilter = document.getElementById('opportunityProductFilter')?.value || 'all';
    
    let filteredOpportunities = opportunities.filter(opp => {
        const matchesSearch = opp.customerName.toLowerCase().includes(searchTerm) || 
                            opp.company.toLowerCase().includes(searchTerm) ||
                            opp.product.toLowerCase().includes(searchTerm);
        const matchesStatus = statusFilter === 'all' || opp.status === statusFilter;
        const matchesProduct = productFilter === 'all' || opp.product === productFilter;
        return matchesSearch && matchesStatus && matchesProduct;
    });
    
    // 根据用户角色过滤数据
    if (currentUser && currentUser.role !== 'admin') {
        filteredOpportunities = filteredOpportunities.filter(o => o.createdBy === currentUser.id);
    }
    
    const tbody = document.getElementById('opportunityTableBody');
    tbody.innerHTML = '';
    
    filteredOpportunities.forEach(opp => {
        const row = document.createElement('tr');
        row.className = 'hover:bg-gray-50 transition-colors';
        
        const statusColors = {
            '进行中': 'bg-blue-100 text-blue-700',
            '已交付': 'bg-green-100 text-green-700'
        };
        
        const discountAmount = opp.originalPrice - opp.amount;
        
        row.innerHTML = `
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">${opp.customerName}</div>
                <div class="text-sm text-gray-500">${opp.company}</div>
            </td>
            <td class="px-6 py-4">
                <div class="text-sm text-gray-900">${opp.email}</div>
                <div class="text-sm text-gray-500">${opp.phone}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="font-medium text-gray-900">${opp.product}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-500">原价: ¥${opp.originalPrice.toLocaleString()}</div>
                ${opp.discount > 0 ? `<div class="text-xs text-red-600 font-medium">折扣: ${opp.discount}%</div>` : ''}
                <div class="text-sm font-bold text-gray-900">¥${opp.amount.toLocaleString()}</div>
                ${discountAmount > 0 ? `<div class="text-xs text-green-600">优惠: ¥${discountAmount.toLocaleString()}</div>` : ''}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-3 py-1 rounded-full text-xs ${statusColors[opp.status]}">${opp.status}</span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>交付: ${opp.deliveryDays}天</div>
                <div>回款: ${opp.paymentDays}天</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button onclick="editOpportunity(${opp.id})" class="text-indigo-600 hover:text-indigo-900 mr-3">
                    <i class="fas fa-edit"></i> 编辑
                </button>
                <button onclick="deleteOpportunity(${opp.id})" class="text-red-600 hover:text-red-900">
                    <i class="fas fa-trash"></i> 删除
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    updateOpportunityStats();
}

// 更新商机统计
function updateOpportunityStats() {
    // 根据用户角色过滤数据
    let filteredOpportunities = opportunities;
    if (currentUser && currentUser.role !== 'admin') {
        filteredOpportunities = opportunities.filter(o => o.createdBy === currentUser.id);
    }
    
    const total = filteredOpportunities.length;
    const inProgress = filteredOpportunities.filter(o => o.status === '进行中').length;
    const delivered = filteredOpportunities.filter(o => o.status === '已交付').length;
    const totalAmount = filteredOpportunities.reduce((sum, o) => sum + o.amount, 0);
    
    document.getElementById('totalOpportunities').textContent = total;
    document.getElementById('inProgressOpportunities').textContent = inProgress;
    document.getElementById('deliveredOpportunities').textContent = delivered;
    document.getElementById('totalOpportunityAmount').textContent = '¥' + totalAmount.toLocaleString();
}

// 显示添加商机模态框
function showAddOpportunityModal() {
    currentEditId = null;
    document.getElementById('opportunityModalTitle').textContent = '添加商机';
    document.getElementById('opportunityForm').reset();
    document.getElementById('opportunityModal').classList.remove('hidden');
    calculateOpportunityAmount();
}

// 隐藏商机模态框
function hideOpportunityModal() {
    document.getElementById('opportunityModal').classList.add('hidden');
    currentEditId = null;
}

// 编辑商机
function editOpportunity(id) {
    const opp = opportunities.find(o => o.id === id);
    if (!opp) return;
    
    currentEditId = id;
    document.getElementById('opportunityModalTitle').textContent = '编辑商机';
    document.getElementById('oppCustomerName').value = opp.customerName;
    document.getElementById('oppCompany').value = opp.company;
    document.getElementById('oppEmail').value = opp.email;
    document.getElementById('oppPhone').value = opp.phone;
    document.getElementById('oppProduct').value = opp.product;
    document.getElementById('oppOriginalPrice').value = opp.originalPrice;
    document.getElementById('oppDiscount').value = opp.discount;
    document.getElementById('oppAmount').value = opp.amount;
    document.getElementById('oppStatus').value = opp.status;
    document.getElementById('oppDeliveryDays').value = opp.deliveryDays;
    document.getElementById('oppPaymentDays').value = opp.paymentDays;
    document.getElementById('oppNotes').value = opp.notes;
    
    document.getElementById('opportunityModal').classList.remove('hidden');
}

// 计算商机金额
function calculateOpportunityAmount() {
    const originalPrice = parseFloat(document.getElementById('oppOriginalPrice').value) || 0;
    const discount = parseFloat(document.getElementById('oppDiscount').value) || 0;
    const amount = originalPrice * (1 - discount / 100);
    document.getElementById('oppAmount').value = Math.round(amount);
}

// 保存商机
function saveOpportunity() {
    const customerName = document.getElementById('oppCustomerName').value.trim();
    const company = document.getElementById('oppCompany').value.trim();
    const email = document.getElementById('oppEmail').value.trim();
    const phone = document.getElementById('oppPhone').value.trim();
    const product = document.getElementById('oppProduct').value.trim();
    const originalPrice = parseFloat(document.getElementById('oppOriginalPrice').value);
    const discount = parseFloat(document.getElementById('oppDiscount').value) || 0;
    const amount = parseFloat(document.getElementById('oppAmount').value);
    const status = document.getElementById('oppStatus').value;
    const deliveryDays = parseInt(document.getElementById('oppDeliveryDays').value);
    const paymentDays = parseInt(document.getElementById('oppPaymentDays').value);
    const notes = document.getElementById('oppNotes').value.trim();
    
    if (!customerName || !company || !email || !product || !originalPrice || !amount) {
        alert('请填写必填字段！');
        return;
    }
    
    if (currentEditId) {
        // 编辑现有商机
        const opp = opportunities.find(o => o.id === currentEditId);
        opp.customerName = customerName;
        opp.company = company;
        opp.email = email;
        opp.phone = phone;
        opp.product = product;
        opp.originalPrice = originalPrice;
        opp.discount = discount;
        opp.amount = amount;
        opp.status = status;
        opp.deliveryDays = deliveryDays;
        opp.paymentDays = paymentDays;
        opp.notes = notes;
    } else {
        // 添加新商机
        const newOpp = {
            id: opportunities.length > 0 ? Math.max(...opportunities.map(o => o.id)) + 1 : 1,
            customerName,
            company,
            email,
            phone,
            product,
            originalPrice,
            discount,
            amount,
            status,
            deliveryDays,
            paymentDays,
            notes,
            createdBy: currentUser.id,
            createdAt: new Date().toISOString().split('T')[0]
        };
        opportunities.push(newOpp);
    }
    
    localStorage.setItem('opportunities', JSON.stringify(opportunities));
    hideOpportunityModal();
    renderOpportunities();
    updateDashboard();
}

// 删除商机
function deleteOpportunity(id) {
    if (confirm('确定要删除这个商机吗？')) {
        opportunities = opportunities.filter(o => o.id !== id);
        localStorage.setItem('opportunities', JSON.stringify(opportunities));
        renderOpportunities();
        updateDashboard();
    }
}

// 渲染数据分析
function renderAnalytics() {
    // 根据用户角色过滤数据
    let filteredCustomers = customers;
    let filteredInteractions = interactions;
    
    if (currentUser && currentUser.role !== 'admin') {
        filteredCustomers = customers.filter(c => c.createdBy === currentUser.id);
        const customerIds = filteredCustomers.map(c => c.id);
        filteredInteractions = interactions.filter(i => customerIds.includes(i.customerId));
    }
    
    // 客户状态分布
    const statusChart = echarts.init(document.getElementById('statusChart'));
    const statusData = [
        { value: filteredCustomers.filter(c => c.status === '活跃').length, name: '活跃' },
        { value: filteredCustomers.filter(c => c.status === '潜在').length, name: '潜在' },
        { value: filteredCustomers.filter(c => c.status === '休眠').length, name: '休眠' }
    ];
    
    statusChart.setOption({
        title: {
            text: '客户状态分布',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left'
        },
        series: [{
            type: 'pie',
            radius: '50%',
            data: statusData,
            emphasis: {
                itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            },
            color: ['#10b981', '#f59e0b', '#6b7280']
        }]
    });
    
    // 月度交互趋势
    const trendChart = echarts.init(document.getElementById('trendChart'));
    const months = ['1月', '2月', '3月', '4月', '5月', '6月'];
    const trendData = [8, 12, 15, 18, 22, filteredInteractions.length];
    
    trendChart.setOption({
        title: {
            text: '月度交互趋势',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            type: 'category',
            data: months
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: trendData,
            type: 'bar',
            itemStyle: {
                color: '#8b5cf6'
            }
        }]
    });
    
    // 响应窗口大小变化
    window.addEventListener('resize', () => {
        statusChart.resize();
        trendChart.resize();
    });
}

// 页面加载完成后初始化
window.addEventListener('load', () => {
    initializeData();
});
```
