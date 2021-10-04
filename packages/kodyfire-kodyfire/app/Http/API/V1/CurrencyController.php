<?php
namespace App\Http\Controllers\API\V1;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Log;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;
use App\Http\Requests\CreateCurrencyRequest;
use App\Http\Requests\UpdateCurrencyRequest;
use App\Storage\DataBag;
use App\Models\Currency;
use App\Repositories\CurrencyRepository;

class CurrencyController extends Controller
{
    
    public function getAll(Request  $request) {
      try {
      $configs = [];
      
      
          if (!$request->has('pagination')) {
            $data = Currency::all();
            
          } else {
            $pageSize = $request->query('pageSize');
            $currentPage = $request->query('currentPage');
            $search = $request->query('search');
            Paginator::currentPageResolver(function () use ($currentPage) {
                return $currentPage;
            });
            $data = Currency::paginate($pageSize);
            if($search != ""){
                $data = Currency::search($search)->paginate($pageSize);
            }
            
          }
    } catch (\Throwable $th) {
      Log::error($th->getMessage());
      return response()->json([
            'error' => 'Une erreur est parvenue',
        ], 500);
    }
    return response()->json(['data' => $data,'configs' => $configs]);
          }

    public function get(Currency $currency)
    {
      try {
        $data = $currency;
      } catch (\Throwable $th) {
        Log::error($th->getMessage());
          return response()->json([
              'error' => 'Une erreur est parvenue',
          ], 500);
      }
      return response()->json(['data' => $data]);
    }

    public function create(CreateCurrencyRequest $request, CurrencyRepository $repository)
    {
        $data = new DataBag(['data' => $request->all()]);
        try {
            $model = $repository->create($data);
        } catch (\Exception $e) {
            Log::error($e->getMessage());
            return response()->json([
                'error' => $e->getMessage(),
            ], 500);
        }
        $message = trans('app.createSuccessMsg');
        return response()->json(['data' => $model, 'message' => $message, 'success' => true]);
    }

    public function update(UpdateCurrencyRequest $request, Currency $currency, CurrencyRepository $repository) {
      $data = new DataBag(['data' => $request->all()]);
      try {
          $model = $repository->update($currency, $data);
      } catch (\Exception $e) {
          Log::error($e->getMessage());
          return response()->json([
              'error' => $e->getMessage(),
          ], 500);
      }
      $message = trans('app.updateSuccessMsg');
      return response()->json(['data' => $model, 'message' => $message, 'success' => true]);
      }

    public function delete(Currency $currency) {
    try {
        
        $currency->delete();
    } catch (\Exception $e) {
        Log::error($e->getMessage());
            return response()->json([
        'error' => 'Une erreur est parvenue',
        ], 500);
    }
    $message = trans('app.deleteSuccessMsg');
    return response()->json(['message' => $message], 200);
    }

}
    