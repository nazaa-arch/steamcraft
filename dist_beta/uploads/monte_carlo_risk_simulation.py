# STEAM-Craft Actuarial Risk Simulation
# Monte Carlo 10,000 Iterations for Living Cost Deficit Risk

import numpy as np

def simulate_deficit_risk(n_iterations=10000, allowance=2500000):
    np.random.seed(42)
    # Food expenditure (lognormal distribution)
    food = np.random.lognormal(mean=14.1, sigma=0.25, size=n_iterations)
    # Housing & Utilities (normal distribution)
    housing = np.random.normal(loc=850000, scale=120000, size=n_iterations)
    # Academic & Unplanned (extreme value distribution)
    emergency = np.random.gumbel(loc=300000, scale=150000, size=n_iterations)
    
    total_expense = food + housing + emergency
    deficit = total_expense - allowance
    prob_deficit = np.mean(deficit > 0)
    var_95 = np.percentile(total_expense, 95)
    
    return {
        'prob_deficit': float(prob_deficit),
        'var_95': float(var_95),
        'mean_deficit': float(np.mean(np.maximum(0, deficit)))
    }

if __name__ == '__main__':
    results = simulate_deficit_risk()
    print("Simulation Completed:", results)
